import ccxt from "ccxt";
import { Request, Response } from "express";
import { ServerResponse } from "../ultils/server-response.ultil";
// const fetch = require('node-fetch')
// import fetch from "node-fetch";

const binance = new ccxt.binance({
  headers: {
    apiKey: "1A0eAdDSYP6mamVZRCmc0cSt4qm4K7pwaONb55yTlIdfuHMUYmyztBZnSbZ3hPBb",
    secret: "4wTgPjsyA9z1FIyUug81SOuTzCP5pZNyD3wHoIHpkjQ8yzoKUXgLaiV5izztl5qp",
  },
});
const getOHLCV = async (req: Request, res: Response) => {
  try {
    let allCurrencies = await binance.fetchCurrencies(); //why undefined?
    // let fetchMarkets = await binance.fetchMarkets() // not ok
    let tickers = await binance.fetchTickers();
    // let btcOHLCV = await binance.fetchOHLCV("BTC/USDT", "1m", undefined, 10);
    let gAllCurrencies = await getAllCurrencies();
    let data = { allCurrencies, gAllCurrencies };
    console.log("data", data);
    return ServerResponse.response(res, data);
  } catch (e) {
    return ServerResponse.error(res, e.name || "Server err");
  }
};
async function getAllCurrencies() {
  try {
    const data = await binance.publicGetTicker24hr();
    // @ts-ignore
    const currencyData = data.map((item) => ({
      symbol: item.symbol,
      price: parseFloat(item.lastPrice),
      volume: parseFloat(item.quoteVolume),
      percentChange: parseFloat(item.priceChangePercent),
      marketCap: parseFloat(item.quoteVolume) * parseFloat(item.lastPrice),
    }));
    return data;
  } catch (error) {
    console.error("Failed to fetch data:", error.message);
    return null;
  }
}
export default { getOHLCV };
