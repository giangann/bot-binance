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
import {
  TNewOrder,
  TResponSuccess,
  TResponse,
  TResponseFailure,
} from "../types/order";
import { TPosition } from "../types/position";
import { TSymbolPriceTicker } from "../types/symbol-price-ticker";
import {
  orderPiecesToMap,
  positionsToMap,
  symbolPriceTickersToMap,
  validateAmount,
} from "../ultils/helper.ultil";
import { logger } from "./logger.config";

const createInterval = () => {
  const interval = setInterval(async () => {
    console.log("start tick");
    try {
      // fetch binance account info and emit to client
      const accInfo = await binanceService.getAccountInfo();
      global.wsServerGlob.emit("ws-account-info", accInfo);
      // fetch position info and emit to client
      const positions = await binanceService.getPositions();
      global.wsServerGlob.emit("ws-position", positions);

      // fetch symbolPriceTickers now
      const symbolPriceTickers = await binanceService.getSymbolPriceTickers();
      const symbolPriceTickersMap = symbolPriceTickersToMap(symbolPriceTickers);
      global.wsServerGlob.emit("symbols-price", symbolPriceTickers);

      // fetch chain open
      const openChain = await getChainOpen();
      if (openChain) {
        // fetch symbolPriceTickers 1AM from DB
        const symbolPriceTickers1Am =
          await binanceService.getSymbolPriceTickers1Am();
        const symbolPriceTickers1AmMap = symbolPriceTickersToMap(
          symbolPriceTickers1Am
        );

        // // fetch list position
        const positions = await binanceService.getPositions();
        const positionsMap = positionsToMap(positions);

        // orderPieces of current order chain
        const orderPiecesMap = orderPiecesToMap(openChain.order_pieces);

        // gen order params
        const orderParams = genMarketOrderParams(
          symbolPriceTickersMap,
          symbolPriceTickers1AmMap,
          positionsMap,
          orderPiecesMap,
          openChain
        );

        const createdOrders = await makeOrders(orderParams);
        const successOrders = filterOrder(
          createdOrders,
          true
        ) as TResponSuccess<TNewOrder>[];
        const failureOrders = filterOrder(
          createdOrders,
          false
        ) as TResponseFailure[];

        const successOrdersData = successOrders.map((order) => {
          return order.data;
        });

        const logParmas = genLogParams(failureOrders, openChain.id);
        await saveLogs(logParmas);

        const orderPieceParams = genOrderPieceParams(
          successOrdersData,
          orderParams,
          openChain.id
        );
        await saveOrderPieces(orderPieceParams);

        global.wsServerGlob.emit(
          "bot-tick",
          orderParams.length,
          successOrders.length,
          failureOrders.length
        );
      }
    } catch (err) {
      const appErr = { name: err.name, message: err.message };
      global.wsServerGlob.emit("app-err", JSON.stringify(appErr));
      logger.error(err.message);
    }

    console.log("emit and end tick");
  }, 10000);

  global.tickInterval = interval;
};

type TOrderParams = {
  symbol: string;
  direction: "BUY" | "SELL";
  amount: number;
  percent?: number;
  order_size?: number;
  price_ticker?: number;
};
function genMarketOrderParams(
  symbolPriceTickersMap: Record<string, TSymbolPriceTicker>,
  symbolPriceTickers1AmMap: Record<string, Omit<TSymbolPriceTicker, "time">>,
  positionsMap: Record<string, TPosition>,
  orderPiecesMap: Record<string, IMarketOrderPieceRecord>,
  openChain: IMarketOrderChainEntity
) {
  try {
    const {
      percent_to_first_buy,
      percent_to_buy,
      percent_to_sell,
      transaction_size_start,
    } = openChain;
    let orderParams: TOrderParams[] = [];
    // loop through symbolPriceTickers
    const symbols = Object.keys(symbolPriceTickersMap);
    for (let symbol of symbols) {
      // get prev price
      let prevPrice = parseFloat(symbolPriceTickers1AmMap[symbol]?.price);
      // check to day has order
      let todayLatestOrder = orderPiecesMap[symbol];
      if (todayLatestOrder) {
        prevPrice = parseFloat(todayLatestOrder.price);
      }
      // get current price
      let currPrice = parseFloat(symbolPriceTickersMap[symbol]?.price);

      // check if need to skip, continue to next symbol
      if (!prevPrice || !currPrice) {
        continue;
      }

      // calculate percentChange
      const percent_change = (currPrice / prevPrice - 1) * 100;

      // direction and order_size
      let direction: "BUY" | "SELL" | "" = "";
      let order_size = transaction_size_start;
      if (percent_change <= parseFloat(percent_to_sell)) {
        direction = "SELL";
        if (todayLatestOrder) {
          let prevSize = parseFloat(todayLatestOrder.transaction_size);
          order_size = prevSize / 2;
        }
      }
      if (percent_change >= parseFloat(percent_to_buy)) {
        direction = "BUY";
        if (todayLatestOrder) {
          let prevSize = parseFloat(todayLatestOrder.transaction_size);
          order_size = prevSize * 2;
        }
      }
      // for the first time
      if (
        !todayLatestOrder &&
        percent_change >= parseFloat(percent_to_first_buy)
      ) {
        direction = "BUY";
        order_size = transaction_size_start;
      }

      let amount = order_size / currPrice;
      if (direction !== "") {
        // check if amount able
        if (direction === "SELL") {
          const currPosition = positionsMap[symbol];
          if (currPosition) {
            const positionAmt = parseFloat(currPosition.positionAmt);
            if (!positionAmt) continue; // if don't have this position so skip
            if (positionAmt < amount) amount = positionAmt;
          }
        }
        orderParams.push({
          amount: validateAmount(amount),
          direction,
          symbol,
          percent: percent_change,
          order_size,
          price_ticker: currPrice,
        });
      }
    }
    console.log("total generated params: ", orderParams.length, " orders");
    return orderParams;
  } catch (err) {
    console.log(err);
  }
}
async function makeOrders(orderParams: TOrderParams[]) {
  const promises = orderParams.map(async (param) => {
    const { symbol, amount, direction } = param;
    try {
      return await binanceService.createMarketOrder(symbol, direction, amount);
    } catch (error) {
      console.log("error", error);
    }
  });

  return Promise.all(promises);
}
function genOrderPieceParams(
  newOrders: TNewOrder[],
  orderParams: TOrderParams[],
  chainId: number
): IMarketOrderPieceCreate[] {
  let orderPieceParams: IMarketOrderPieceCreate[] = [];

  for (let newOrder of newOrders) {
    for (let orderParam of orderParams) {
      if (newOrder?.symbol === orderParam.symbol) {
        let orderPiceParam: IMarketOrderPieceCreate = {
          id: newOrder.orderId.toString(),
          market_order_chains_id: chainId,
          amount: orderParam.amount.toString(),
          direction: orderParam.direction,
          percent_change: orderParam.percent.toFixed(5),
          symbol: orderParam.symbol,
          price: orderParam.price_ticker.toString(),
          total_balance: "0.00", // can't defined
          transaction_size: orderParam.order_size.toString(),
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

function filterOrder(newOrders: TResponse<TNewOrder>[], success: boolean) {
  return newOrders.filter((newOrder) => newOrder.success === success);
}

// if order with same symbol, get only 1 latest order
async function getChainOpen(): Promise<IMarketOrderChainEntity | null> {
  const openChain = await marketOrderChainService.list({ status: "open" });
  if (openChain.length) return openChain[0];
  else return null;
}

export { createInterval };
