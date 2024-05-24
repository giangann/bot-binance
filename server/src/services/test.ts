import { connectDatabase } from "../loaders/db-connect";
import binanceService from "./binance.service";
import CoinService from "./coin.service";
import logService from "./log.service";
import { TResponseFailure } from "../types/order";
import { logger } from "../loaders/logger.config";
import {
  exchangeInfoSymbolsToMap,
  orderPiecesToMap,
  positionsToMap,
  symbolPriceTickersToMap,
  validateAmount,
} from "../ultils/helper.ultil";
import botService from "./bot.service";
import marketOrderChainService from "./market-order-chain.service";
import { TSymbolPriceTicker } from "../types/symbol-price-ticker";
import { TPosition } from "../types/position";
import {
  IMarketOrderPieceCreate,
  IMarketOrderPieceRecord,
} from "market-order-piece.interface";
import { IMarketOrderChainEntity } from "market-order-chain.interface";
import { TExchangeInfoSymbol } from "../types/exchange-info";
import marketOrderPieceService from "./market-order-piece.service";
import { ILogCreate } from "log.interface";
const coinService = new CoinService(true);
const test = async () => {
  await connectDatabase();
  console.log("start");
  const startTime = Date.now();
  const accInfo = await binanceService.getAccountInfo();
  const positions = await binanceService.getPositions();
  const positionsMap = positionsToMap(positions);

  const symbolPriceTickers = await binanceService.getSymbolPriceTickers();
  const symbolPriceTickersMap = symbolPriceTickersToMap(symbolPriceTickers);

  const exchangeInfo = await binanceService.getExchangeInfo();
  const exchangeInfoSymbolsMap = exchangeInfoSymbolsToMap(exchangeInfo.symbols);

  const openChain = (await marketOrderChainService.list({ status: "open" }))[0];
  const orderPiecesMap = orderPiecesToMap(openChain.order_pieces);

  const symbolPriceTickers1Am = await binanceService.getSymbolPriceTickers1Am();
  const symbolPriceTickers1AmMap = symbolPriceTickersToMap(
    symbolPriceTickers1Am
  );

  const orderParams = genMarketOrderParams(
    symbolPriceTickersMap,
    symbolPriceTickers1AmMap,
    positionsMap,
    orderPiecesMap,
    openChain,
    exchangeInfoSymbolsMap
  );
  const ordersResponse = await makeManyOrder();
  const piecesResponse = await saveOrderPieces();
  const logResponse = await saveLogs();

  console.log(
    "able params:",
    orderParams.length,
    "order response:",
    ordersResponse.length,
    "pieces response: ",
    piecesResponse.length,
    "log response: ",
    logResponse.length
  );
  console.log("done, time = ", Date.now() - startTime, "ms");
};
// test();

// save 50 pieces inside chain_id=46
async function saveOrderPieces() {
  let piecesParams = [];
  for (let i = 1; i <= 50; i++) {
    let piece: IMarketOrderPieceCreate = {
      market_order_chains_id: 46,
      symbol: "COIN_A",
      amount: "0",
      direction: "SELL",
      id: i.toString(),
      percent_change: "0",
      price: "0",
      total_balance: "0",
      transaction_size: "0",
    };
    piecesParams.push(piece);
  }

  const createPiecePromises = piecesParams.map((param) => {
    return marketOrderPieceService.create(param);
  });

  const response = await Promise.all(createPiecePromises);
  return response;
}

// save 300 logs for chain_id=46
async function saveLogs() {
  let logParams = [];
  for (let i = 0; i <= 300; i++) {
    let log: ILogCreate = {
      market_order_chains_id: 46,
      message: "test",
      type: "test",
    };
    logParams.push(log);
  }

  const logPromises = logParams.map((log) => {
    return logService.create(log);
  });

  const response = await Promise.all(logPromises);
  return response;
}

function genManyOrderParams() {
  let orderParams = [];
  for (let i = 1; i <= 50; i++) {
    let side: "SELL" | "BUY" = i % 2 === 0 ? "SELL" : "BUY";
    let orderParam = {
      symbol: "BTCUSDT",
      quantity: 0.005,
      side: side,
    };
    orderParams.push(orderParam);
  }
  return orderParams;
}

async function makeManyOrder() {
  const orderParams = genManyOrderParams();
  const orderPromises = orderParams.map((order) => {
    let { symbol, quantity, side } = order;
    return binanceService.createMarketOrder(symbol, side, quantity);
  });

  const response = await Promise.all(orderPromises);
  return response;
}

type TOrderParams = {
  symbol: string;
  direction: "BUY" | "SELL";
  amount: number;
  percent?: number;
  order_size?: number;
  price_ticker?: number;
  positionAmt?: number;
};
function genMarketOrderParams(
  symbolPriceTickersMap: Record<string, TSymbolPriceTicker>,
  symbolPriceTickers1AmMap: Record<string, Omit<TSymbolPriceTicker, "time">>,
  positionsMap: Record<string, TPosition>,
  orderPiecesMap: Record<string, IMarketOrderPieceRecord>,
  openChain: IMarketOrderChainEntity,
  exchangeInfoSymbolsMap: Record<string, TExchangeInfoSymbol>
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
      const percent_change = (currPrice / prevPrice - 1) * 100;

      // get position
      let position = positionsMap[symbol]; // positions just have symbol that positionAmt > 0
      let positionAmt = parseFloat(position?.positionAmt);

      // direction and order_size intitial
      let direction: "BUY" | "SELL" | "" = "";
      let amount = transaction_size_start / currPrice;

      // direction calculate
      const isFirstBuy =
        percent_change >= parseFloat(percent_to_first_buy) &&
        hasOrderToday === false;
      if (percent_change <= parseFloat(percent_to_sell)) direction = "SELL";
      if (percent_change >= parseFloat(percent_to_buy) || isFirstBuy)
        direction = "BUY";
      if (direction === "") continue;

      // order_size calculate
      if (direction === "SELL") {
        if (!position || !positionAmt) continue;
        amount = positionAmt / 2;
      }
      if (direction === "BUY") {
        if (!position || !positionAmt) {
          if (isFirstBuy) amount = transaction_size_start / currPrice;
          else continue;
        }
        if (position && positionAmt) amount = positionAmt;
      }

      // amount precision
      const quantityPrecision =
        exchangeInfoSymbolsMap[symbol]?.quantityPrecision;
      orderParams.push({
        amount: validateAmount(amount, quantityPrecision),
        direction,
        symbol,
        percent: percent_change,
        order_size: Math.round(amount * currPrice),
        price_ticker: currPrice,
        positionAmt,
      });
    }
    console.log("total generated params: ", orderParams.length, " orders");
    return orderParams;
  } catch (err) {
    console.log(err);
  }
}

