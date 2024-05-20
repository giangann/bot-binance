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
  const symbol = "BTCUSDT";
  const direction = "SELL";
  let amount = 0.05;

  await botService.createOrder(112, symbol, direction, amount);
};
// test();
