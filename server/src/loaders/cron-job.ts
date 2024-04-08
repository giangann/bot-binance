import axios from "axios";
import { ICoin } from "coin.interface";
import coinService from "../services/coin.service";
import cron from "node-cron";

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
    }
  );

  task.start();
};

async function crawCoinPrices() {
  const response = await axios.get(
    "https://fapi.binance.com/fapi/v2/ticker/price"
  );

  const coins: ICoin[] = response.data;
  return coins;
}

async function updateCoinTable() {
  const coins = await crawCoinPrices();
  const createdCoins = await Promise.all(
    coins.map((coin) => {
      return coinService.create(coin);
    })
  );
  return createdCoins;
}
