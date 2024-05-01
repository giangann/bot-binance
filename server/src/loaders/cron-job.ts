import axios from "axios";
import cron from "node-cron";
import CoinService from "../services/coin.service";
import { TSymbolMarkPrice } from "../types/symbol-mark-price";
import { TSymbolPriceTicker } from "../types/symbol-price-ticker";
import { connectDatabase } from "./db-connect";

const futureTestnetUrl = "https://testnet.binancefuture.com";
const futureUrl = "https://fapi.binance.com";

const coinTestnetService = new CoinService(true);
const coinFutureService = new CoinService(false);

export const cronJobSchedule = async () => {
  console.log("cron job file");
  const task = cron.schedule(
    "0 0 1 * * *",
    () => {
      console.log("task run");
      // testnet
      updateCoinTestnetTableMarkPriceCol();
      updateCoinTestnetTableTickerPriceCol();
      // future
      updateCoinFutureTableTickerPriceCol();
      updateCoinFutureTableMarkPriceCol();
    },
    {
      scheduled: false,
      timezone: "Asia/Ho_Chi_Minh",
    }
  );

  task.start();
};

async function updateCoinTestnetTableTickerPriceCol() {
  try {
    const symbolPriceTickersNow = await getSymbolPriceTickers(futureTestnetUrl);
    const updatedCoins = await Promise.all(
      symbolPriceTickersNow.map((symbolPrice) => {
        return coinTestnetService.update({
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

async function updateCoinTestnetTableMarkPriceCol() {
  try {
    const symbolMarkPrice = await getSymbolMarketPrices(futureTestnetUrl);
    const updatedCoins = await Promise.all(
      symbolMarkPrice.map((symbolPrice) => {
        return coinTestnetService.update({
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

async function updateCoinFutureTableTickerPriceCol() {
  try {
    const symbolPriceTickersNow = await getSymbolPriceTickers(futureUrl);
    const updatedCoins = await Promise.all(
      symbolPriceTickersNow.map((symbolPrice) => {
        return coinFutureService.update({
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

async function updateCoinFutureTableMarkPriceCol() {
  try {
    const symbolMarkPrice = await getSymbolMarketPrices(futureUrl);
    const updatedCoins = await Promise.all(
      symbolMarkPrice.map((symbolPrice) => {
        return coinFutureService.update({
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
  // testnet
  await updateCoinTestnetTableMarkPriceCol();
  await updateCoinTestnetTableTickerPriceCol();
  // future
  await updateCoinFutureTableTickerPriceCol();
  await updateCoinFutureTableMarkPriceCol();
};
// test();
