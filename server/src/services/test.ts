import { connectDatabase } from "../loaders/db-connect";
import binanceService from "./binance.service";
import CoinService from "./coin.service";
import logService from "./log.service";
import { TResponseFailure } from "../types/order";
import { logger } from "../loaders/logger.config";
import { positionsToMap } from "../ultils/helper.ultil";
import botService from "./bot.service";
const coinService = new CoinService(true);
const test = async () => {
  // // const symbol = "TOKENUSDT";
  // // const direction = "SELL";
  // // let amount = 20;
  // // const response = await binanceService.createMarketOrder(
  // //   symbol,
  // //   direction,
  // //   amount
  // // );
  // console.log("response", response);
  logger.info('info level test')
  // logger.error('error level test')
  // logger.debug('debug level test')
};
test();
