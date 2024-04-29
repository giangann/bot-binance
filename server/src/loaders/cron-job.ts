import axios from "axios";
import cron from "node-cron";
import coinService from "../services/coin.service";
import { TSymbolMarkPrice } from "../types/symbol-mark-price";
import { TSymbolPriceTicker } from "../types/symbol-price-ticker";
import { connectDatabase } from "./db-connect";

const futureTestnetUrl = "https://testnet.binancefuture.com";
const futureUrl = "https://fapi.binance.com";

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
    await updateCoinTableFTickerPrice();
    await updateCoinTableFMarkPrice();
  } catch (err) {
    console.log(err);
  }
}

async function updateCoinTableTickerPrice() {
  try {
    const symbolPriceTickersNow = await getSymbolPriceTickers(futureTestnetUrl);
    const updatedCoins = await Promise.all(
      symbolPriceTickersNow.map((symbolPrice) => {
        return coinService.update({
          symbol: symbolPrice.symbol,
          price: symbolPrice.price,
        });
      })
    );
    return updatedCoins;
  } catch (err) {
    console.log(err);
  }
}

async function updateCoinTableMarkPrice() {
  try {
    const symbolMarkPrice = await getSymbolMarketPrices(futureTestnetUrl);
    const updatedCoins = await Promise.all(
      symbolMarkPrice.map((symbolPrice) => {
        return coinService.update({
          symbol: symbolPrice.symbol,
          mark_price: symbolPrice.markPrice,
        });
      })
    );
    return updatedCoins;
  } catch (err) {
    console.log(err);
  }
}

async function updateCoinTableFTickerPrice() {
  try {
    const futureSymbolTickerPrices = await getSymbolPriceTickers(futureUrl);
    console.log(
      "futureSymbolTickerPrices",
      futureSymbolTickerPrices.slice(0, 5)
    );
    const updatedCoins = await Promise.all(
      futureSymbolTickerPrices.map((symbolPrice) => {
        return coinService.update({
          symbol: symbolPrice.symbol,
          f_price: symbolPrice.price,
        });
      })
    );
    return updatedCoins;
  } catch (err) {
    console.log(err);
  }
}

async function updateCoinTableFMarkPrice() {
  try {
    const symbolMarkPrice = await getSymbolMarketPrices(futureUrl);
    const updatedCoins = await Promise.all(
      symbolMarkPrice.map((symbolPrice) => {
        return coinService.update({
          symbol: symbolPrice.symbol,
          f_mark_price: symbolPrice.markPrice,
        });
      })
    );
    return updatedCoins;
  } catch (err) {
    console.log(err);
  }
}

const getSymbolPriceTickers = async (
  baseUrl: string
): Promise<TSymbolPriceTicker[]> => {
  const endpoint = "/fapi/v2/ticker/price";
  const url = `${baseUrl}${endpoint}`;
  const response = await axios.get(url);
  const tickersPrice: TSymbolPriceTicker[] = response.data;
  return tickersPrice;
};

const getSymbolMarketPrices = async (
  baseUrl: string
): Promise<TSymbolMarkPrice[]> => {
  const endpoint = "/fapi/v1/premiumIndex";
  const url = `${baseUrl}${endpoint}`;
  const response = await axios.get(url);
  const markPrices: TSymbolMarkPrice[] = response.data;
  return markPrices;
};

const test = async () => {
  await connectDatabase();
  await updateCoinTable();
};
test();
