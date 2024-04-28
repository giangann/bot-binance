import cron from "node-cron";
import binanceService from "../services/binance.service";
import coinService from "../services/coin.service";
import { connectDatabase } from "./db-connect";

export const cronJobSchedule = async () => {
  console.log("cron job file");
  const task = cron.schedule(
    "0 15 0 * * *",
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

async function updateCoinTable() {
  try {
    await updateCoinTableTickerPrice();
    await updateCoinTableMarkPrice();
  } catch (err) {
    console.log(err);
  }
}

async function updateCoinTableTickerPrice() {
  try {
    const symbolPriceTickersNow = await binanceService.getSymbolPriceTickers();
    const updatedCoins = await Promise.all(
      symbolPriceTickersNow.map((symbolPrice) => {
        return coinService.update(symbolPrice);
      })
    );
    return updatedCoins;
  } catch (err) {
    console.log(err);
  }
}

async function updateCoinTableMarkPrice() {
  try {
    const symbolMarkPrice = await binanceService.getSymbolMarketPrices();
    const updatedCoins = await Promise.all(
      symbolMarkPrice.map((symbolPrice) => {
        return coinService.update({
          ...symbolPrice,
          mark_price: symbolPrice.markPrice,
        });
      })
    );
    return updatedCoins;
  } catch (err) {
    console.log(err);
  }
}

const test = async () => {
  await connectDatabase();
  await updateCoinTable();
};
test();
