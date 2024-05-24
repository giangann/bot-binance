import { connectDatabase } from "../loaders/db-connect";
import binanceService from "./binance.service";
import CoinService from "./coin.service";
import logService from "./log.service";
import { TNewOrder, TResponseFailure } from "../types/order";
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
import loggerService from "./logger.service";
const coinService = new CoinService(true);

const test = async () => {
  await connectDatabase();
  const tickers = await binanceService.getSymbolPriceTickers();
  const tickers1Am = await binanceService.getSymbolPriceTickers1Am();

  // for (let i = 1; i <= 3; i++) {
  //   for (let ticker of tickers) {
  //     for (let ticker1Am of tickers1Am) {
  //       if (ticker.symbol === ticker1Am.symbol) {
  //         let { price, symbol } = ticker;
  //         let { price: price1Am } = ticker1Am;
  //         let percentChange =
  //           (parseFloat(price) / parseFloat(price1Am) - 1) * 100;

  //         let side = "SELL";
  //         if (percentChange >= 5) side = "BUY";
  //         if (percentChange <= 2.5) side = "SELL";

  //         loggerService.saveOrderLog(
  //           {
  //             orderId: 2344592,
  //             origQty: (100 / parseFloat(price)).toFixed(2),
  //             side,
  //             symbol,
  //           },
  //           "440",
  //           percentChange,
  //           price,
  //           price1Am,
  //           false,
  //           100
  //         );
  //       }
  //     }
  //   }
  // }

  // loggerService.saveTickLog(90, 50, 40, 40, 6702, 46);

  // read log
  
  
  displayLogFile();
};

import fs from "fs";
const displayLogFile = () => {
  fs.readFile("./order-debug.log", "utf8", (err, file) => {
    console.log("json data: ", file);
    console.log("parse data: ", JSON.parse(file));
    console.log("err: ", err);
  });
};

// test();
