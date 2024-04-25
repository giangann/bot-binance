import cron from "node-cron";
import binanceService from "../services/binance.service";
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

async function updateCoinTable() {
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
