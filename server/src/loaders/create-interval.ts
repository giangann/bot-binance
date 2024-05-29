import { ILogCreate } from "log.interface";
import { IMarketOrderChainEntity } from "market-order-chain.interface";
import {
  IMarketOrderPieceCreate,
  IMarketOrderPieceRecord,
} from "market-order-piece.interface";
import binanceService from "../services/binance.service";
import logService from "../services/log.service";
import marketOrderChainService from "../services/market-order-chain.service";
import marketOrderPieceService from "../services/market-order-piece.service";
import { TExchangeInfoSymbol } from "../types/exchange-info";
import {
  TNewOrder,
  TOrderInfo,
  TOrderMoreInfo,
  TOrderParam,
  TOrderReason,
  TResponseFailure,
} from "../types/order";
import { TPosition } from "../types/position";
import { TSymbolPriceTicker } from "../types/symbol-price-ticker";
import {
  exchangeInfoSymbolsToMap,
  filterFailOrder,
  filterSuccessOrder,
  orderPiecesToMap,
  positionsToMap,
  symbolPriceTickersToMap,
  validateAmount,
} from "../ultils/helper.ultil";
import { logger } from "./logger.config";
import { throwError } from "../ultils/error-handler.ultil";

const createInterval = () => {
  const interval = setInterval(async () => {
    console.log("start tick");
    try {
      // fetch statistic
      const accInfo = await binanceService.getAccountInfo();
      const positions = await binanceService.getPositions();
      const tickers = await binanceService.getSymbolPriceTickers();
      const { symbols } = await binanceService.getExchangeInfo();

      global.wsServerGlob.emit("ws-account-info", accInfo);
      global.wsServerGlob.emit("ws-position", positions);
      global.wsServerGlob.emit("symbols-price", tickers);

      // fetch chain open
      const openChain = await getChainOpen();
      if (openChain) {
        // fetch symbolPriceTickers 1AM from DB
        const tickers1AM = await binanceService.getSymbolPriceTickers1Am();

        // storage statistic in Object
        const symbolPriceTickersMap = symbolPriceTickersToMap(tickers);
        const exchangeInfoSymbolsMap = exchangeInfoSymbolsToMap(symbols);
        const symbolPriceTickers1AmMap = symbolPriceTickersToMap(tickers1AM);
        const positionsMap = positionsToMap(positions);
        const orderPiecesMap = orderPiecesToMap(openChain.order_pieces);

        // gen order params
        const genOrderParamsArgs: Parameters<typeof genOrderInfoArray> = [
          symbolPriceTickersMap,
          symbolPriceTickers1AmMap,
          positionsMap,
          orderPiecesMap,
          openChain,
          exchangeInfoSymbolsMap,
        ];
        const orderInfos = genOrderInfoArray(...genOrderParamsArgs);

        // make order and handle response
        const createdOrders = await makeOrders(orderInfos);
        const successOrders = filterSuccessOrder(createdOrders);
        const failureOrders = filterFailOrder(createdOrders);
        const successOrdersData = successOrders.map((order) => order.data);

        // save log database
        const logParmas = genLogParams(failureOrders, openChain.id);
        await saveLogs(logParmas);

        // gen order pieces params and save to database
        const orderPiecesInfo: Parameters<typeof genOrderPieceParams> = [
          successOrdersData,
          orderInfos,
          openChain.id,
        ];
        const orderPieceParams = genOrderPieceParams(...orderPiecesInfo);
        await saveOrderPieces(orderPieceParams);

        // save success order to debug log
        // saveOrderDebugLog(successOrdersData, orderParams, openChain.id);

        global.wsServerGlob.emit(
          "bot-tick",
          orderInfos.length,
          successOrders.length,
          failureOrders.length
        );
      }
    } catch (err) {
      if (err instanceof Error) {
        const { name, message, cause } = err;
        global.wsServerGlob.emit("app-err", JSON.stringify(err));
        logger.error(`name: ${name}; message: ${message}; cause: ${cause}`);
      } else {
      }
    }

    console.log("emit and end tick");
  }, 10000);
};

function genOrderInfoArray(
  symbolPriceTickersMap: Record<string, TSymbolPriceTicker>,
  symbolPriceTickers1AmMap: Record<string, Omit<TSymbolPriceTicker, "time">>,
  positionsMap: Record<string, TPosition>,
  orderPiecesMap: Record<string, IMarketOrderPieceRecord>,
  openChain: IMarketOrderChainEntity,
  exchangeInfoSymbolsMap: Record<string, TExchangeInfoSymbol>
): TOrderInfo[] {
  try {
    const {
      percent_to_first_buy,
      percent_to_buy,
      percent_to_sell,
      transaction_size_start,
    } = openChain;
    let orderInfoArray: TOrderInfo[] = [];

    // loop through symbolPriceTickers
    const symbols = Object.keys(symbolPriceTickersMap);
    for (let symbol of symbols) {
      // get prev price and current price
      let prevPrice = parseFloat(symbolPriceTickers1AmMap[symbol]?.price);
      let todayLatestOrder = orderPiecesMap[symbol];
      const hasOrderToday = Boolean(todayLatestOrder);
      if (todayLatestOrder) {
        prevPrice = parseFloat(todayLatestOrder.price);
      }
      let currPrice = parseFloat(symbolPriceTickersMap[symbol]?.price);

      // check if need to skip, continue to next symbol
      if (!prevPrice || !currPrice) {
        continue;
      }

      // calculate percentChange
      const percentChange = (currPrice / prevPrice - 1) * 100;

      // get position
      let position = positionsMap[symbol]; // positions just have symbol that positionAmt > 0
      let positionAmt = parseFloat(position?.positionAmt);

      // direction and order_size intitial
      let direction: "BUY" | "SELL" | "" = "";
      let quantity = transaction_size_start / currPrice;

      // direction calculate
      const isFirstBuy =
        percentChange >= parseFloat(percent_to_first_buy) &&
        hasOrderToday === false;
      if (percentChange <= parseFloat(percent_to_sell)) direction = "SELL";
      if (percentChange >= parseFloat(percent_to_buy) || isFirstBuy)
        direction = "BUY";
      if (direction === "") continue;

      // order_size calculate
      if (direction === "SELL") {
        if (!position || !positionAmt) continue;
        quantity = positionAmt / 2;
      }
      if (direction === "BUY") {
        if (!position || !positionAmt) {
          if (isFirstBuy) quantity = transaction_size_start / currPrice;
          else continue;
        }
        if (position && positionAmt) quantity = positionAmt;
      }

      // order params:
      const quantityPrecision =
        exchangeInfoSymbolsMap[symbol]?.quantityPrecision;
      quantity = validateAmount(quantity, quantityPrecision);
      const orderParam: TOrderParam = {
        symbol,
        direction,
        quantity,
      };

      // order reason:
      const orderReason: TOrderReason = {
        isFirstOrder: !hasOrderToday,
        currPrice,
        prevPrice,
        percentChange,
        positionAmt,
      };

      // more info:
      const orderMoreInfo: TOrderMoreInfo = {
        amount: quantity * currPrice,
      };

      // add to array
      orderInfoArray.push({ ...orderParam, ...orderReason, ...orderMoreInfo });
    }
    return orderInfoArray;
  } catch (err) {
    throwError(err);
  }
}
async function makeOrders(orderParams: TOrderParam[]) {
  const promises = orderParams.map((param) => {
    const { symbol, quantity, direction } = param;
    return binanceService.createMarketOrder(symbol, direction, quantity);
  });
  return Promise.all(promises);
}

function genOrderPieceParams(
  newOrders: TNewOrder[],
  orderInfos: TOrderInfo[],
  chainId: number
): IMarketOrderPieceCreate[] {
  let orderPieceParams: IMarketOrderPieceCreate[] = [];

  for (let newOrder of newOrders) {
    for (let orderInfo of orderInfos) {
      if (newOrder?.symbol === orderInfo.symbol) {
        let orderPiceParam: IMarketOrderPieceCreate = {
          id: newOrder.orderId.toString(),
          market_order_chains_id: chainId,
          quantity: orderInfo.quantity.toString(),
          direction: orderInfo.direction,
          percent_change: orderInfo.percentChange.toFixed(5),
          symbol: orderInfo.symbol,
          price: orderInfo.currPrice.toString(),
          total_balance: "0.00", // can't defined
          transaction_size: orderInfo.amount.toString(),
        };
        orderPieceParams.push(orderPiceParam);
      }
    }
  }

  return orderPieceParams;
}
async function saveOrderPieces(orderPieceParams: IMarketOrderPieceCreate[]) {
  return Promise.all(
    orderPieceParams.map(async (param) => {
      return await marketOrderPieceService.create(param);
    })
  );
}

function genLogParams(
  failedOrders: TResponseFailure[],
  chainId: number
): ILogCreate[] {
  let params: ILogCreate[] = [];
  for (let failedOrder of failedOrders) {
    let {
      error: { code, msg },
    } = failedOrder;
    let orderInfo = failedOrder?.payload;
    params.push({
      message: `code: ${code}, message: ${msg}, ${JSON.stringify(orderInfo)}`,
      market_order_chains_id: chainId,
      type: "order-err",
    });
  }
  return params;
}
async function saveLogs(logParams: ILogCreate[]) {
  return Promise.all(
    logParams.map(async (param) => {
      return await logService.create(param);
    })
  );
}

// if order with same symbol, get only 1 latest order
async function getChainOpen(): Promise<IMarketOrderChainEntity | null> {
  const openChain = await marketOrderChainService.list({ status: "open" });
  if (openChain.length) return openChain[0];
  else return null;
}

export { createInterval };
