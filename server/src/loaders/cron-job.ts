import axios from "axios";
import { ICoin } from "coin.interface";
import cron from "node-cron";
import coinService from "../services/coin.service";
import binanceService from "../services/binance.service";

export const cronJobSchedule = async () => {
  console.log("cron job file");
  const task = cron.schedule(
    "0 0 1 * * *",
    () => {
      console.log("task run");
      updateCoinTable();
    },
    {
      scheduled: false,
      timezone: "Asia/Ho_Chi_Minh",
    }
  );

  task.start();
};

async function crawCoinPrices() {
  const symbols = await binanceService.getAllSymbol();
  const prices = await binanceService.getSymbolsClosePrice(symbols);

  return prices;
}

async function updateCoinTable() {
  try {
    const coins = await crawCoinPrices();
    const updatedCoins = await Promise.all(
      coins.map((coin) => {
        let coinParams = { ...coin, price: coin.price.toString() };
        return coinService.update(coinParams);
      })
    );
    return updatedCoins;
  } catch (err) {
    console.log(err);
  }
}
