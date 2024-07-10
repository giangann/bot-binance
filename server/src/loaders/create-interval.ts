import { ILogCreate } from "log.interface";
import { IMarketOrderChainEntity } from "market-order-chain.interface";
import {
  IMarketOrderPieceCreate,
  IMarketOrderPieceRecord,
} from "market-order-piece.interface";
import binanceService from "../services/binance.service";
import logService from "../services/log.service";
import loggerService from "../services/logger.service";
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
import { handleTickError, throwError } from "../ultils/error-handler.ultil";
import {
  exchangeInfoSymbolsToMap,
  filterFailOrder,
  filterSuccessOrder,
  orderPiecesToMap,
  positionsToMap,
  symbolPriceTickersToMap,
  totalUnrealizedPnl,
  validateAmount,
} from "../ultils/helper.ultil";
import botService from "../services/bot.service";

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

        // check if over pnl to stop
        await checkPnlToStop(openChain, positions);

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

        // save failure orders to bot_binance.logs database table
        const logParmas = genLogParams(failureOrders, openChain.id);
        await saveLogs(logParmas);

        // merge successOrders to bot_binance.market_order_pieces database table
        const mergedOrders = mergeOrders(orderInfos, successOrdersData);

        // save success orders to
        const orderPiecesInfo: Parameters<typeof genOrderPieceParams> = [
          mergedOrders,
          openChain.id,
        ];
        const orderPieceParams = genOrderPieceParams(...orderPiecesInfo);
        await saveOrderPieces(orderPieceParams);

        // Side Effect: save success order to debug log
        saveOrderDebugLog(mergedOrders, openChain.id);

        // ws emit result of tick
        global.wsServerGlob.emit(
          "bot-tick",
          orderInfos.length,
          successOrders.length,
          failureOrders.length
        );
      }
    } catch (err) {
      handleTickError(err);
    }

    console.log("emit and end tick");
  }, 20000);
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
      if (
        direction === "SELL" &&
        parseFloat(todayLatestOrder.quantity) <= 1.5 * quantity
      )
        continue;

      // order_size calculate
      if (direction === "SELL") {
        if (!position || !positionAmt) continue;
        quantity = positionAmt / 2;
      }
      if (direction === "BUY") {
        // if percent change is able to BUY:
        // 1. check if is first buy, if first buy so alway buy with amount = transaction_size_start
        // 2. if not first buy, check the current positionAmt of symbol, quantity = positionAmt
        if (isFirstBuy) quantity = transaction_size_start / currPrice;
        if (!isFirstBuy) {
          if (!position || !positionAmt) {
            // log the strange behavior (if not firstBuy but still empty position)
            const errCause = `SYMBOL: ${symbol} IS_FIRST_BUY: ${isFirstBuy} but POSITION: <${position} - ${JSON.stringify(
              position
            )}> POSITION_AMT: ${positionAmt} `;
            loggerService.saveErrorLog(
              new Error("Strange behavior", { cause: errCause })
            );
            // next loop
            continue;
          } else {
            quantity = positionAmt;
          }
        }
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
        quantityPrecision,
      };

      // add to array
      orderInfoArray.push({ ...orderParam, ...orderReason, ...orderMoreInfo });
    }
    return orderInfoArray;
  } catch (err) {
    throwError(err);
  }
}
async function makeOrders(orderInfos: TOrderInfo[]) {
  const promises = orderInfos.map((info) => {
    const { symbol, quantity, direction } = info;
    return binanceService.createMarketOrder(symbol, direction, quantity);
  });
  return Promise.all(promises);
}

function genOrderPieceParams(
  mergedOrders: (TOrderInfo & TNewOrder)[],
  chainId: number
): IMarketOrderPieceCreate[] {
  return mergedOrders.map((mergedOrder) => {
    const {
      orderId,
      quantity,
      direction,
      percentChange,
      symbol,
      currPrice,
      amount,
    } = mergedOrder;
    return {
      id: orderId.toString(),
      market_order_chains_id: chainId,
      quantity: quantity.toString(),
      direction: direction,
      percent_change: percentChange.toFixed(5),
      symbol: symbol,
      price: currPrice.toString(),
      total_balance: "0.00", // can't defined
      transaction_size: amount.toString(),
    };
  });
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

function saveOrderDebugLog(
  mergedOrders: (TNewOrder & TOrderInfo)[],
  chainId: number
) {
  mergedOrders.forEach((mergedOrder) => {
    loggerService.saveOrderLog(mergedOrder, chainId);
  });
}
// if order with same symbol, get only 1 latest order
async function getChainOpen(): Promise<IMarketOrderChainEntity | null> {
  const openChain = await marketOrderChainService.list({ status: "open" });
  if (openChain.length) return openChain[0];
  else return null;
}

// merge each order in success orders with information of this correspond order
function mergeOrders(
  orderInfos: TOrderInfo[],
  newOrders: TNewOrder[]
): (TOrderInfo & TNewOrder)[] {
  let mergedOrders = [];
  for (let newOrder of newOrders) {
    for (let orderInfo of orderInfos) {
      if (newOrder.symbol === orderInfo.symbol) {
        const mergedOrder: TOrderInfo & TNewOrder = {
          ...newOrder,
          ...orderInfo,
        };
        mergedOrders.push(mergedOrder);
      }
    }
  }
  return mergedOrders;
}

async function checkPnlToStop(
  chain: IMarketOrderChainEntity,
  positions: TPosition[]
) {
  const isOverPnlToStop = chain.is_over_pnl_to_stop;
  const pnlToStop = parseFloat(chain.pnl_to_stop);
  const sumUnrealizedPnl = totalUnrealizedPnl(positions);

  // CASE 1
  if (sumUnrealizedPnl < pnlToStop) {
    const stopReason = `PNL: ${sumUnrealizedPnl}`;
    await marketOrderChainService.update({
      id: chain.id,
      status: "closed",
      stop_reason: stopReason,
    });
    await botService.closeAllPositions();

    global.wsServerGlob.emit("bot-quit", "");
  }

  // CASE 2
  // if (isOverPnlToStop) {
  //   if (sumUnrealizedPnl < pnlToStop) {
  //     const stopReason = `PNL: ${sumUnrealizedPnl}`;
  //     await marketOrderChainService.update({
  //       id: chain.id,
  //       status: "closed",
  //       stop_reason: stopReason,
  //     });
  //     await botService.closeAllPositions();

  //     global.wsServerGlob.emit("bot-quit", "");
  //   }
  // } else {
  //   if (sumUnrealizedPnl > pnlToStop) {
  //     await marketOrderChainService.update({
  //       id: chain.id,
  //       is_over_pnl_to_stop: true,
  //     });
  //   }
  // }
}

export { createInterval };
