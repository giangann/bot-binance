import axios from "axios";
import { ICoin } from "coin.interface";
import cron from "node-cron";
import coinService from "../services/coin.service";

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
  const response = await axios.get(
    "https://fapi.binance.com/fapi/v2/ticker/price"
  );

  const coins: ICoin[] = response.data;
  return coins;
}

async function updateCoinTable() {
  try {
    const coins = await crawCoinPrices();
    const updatedCoins = await Promise.all(
      coins.map((coin) => {
        return coinService.update(coin);
      })
    );
    return updatedCoins;
  } catch (err) {
    console.log(err);
  }
}
