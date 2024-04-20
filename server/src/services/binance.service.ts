import axios from "axios";
import ccxt, { Balances } from "ccxt";
import { TSymbolPrice } from "../types/symbol-price";
import dotenv from "dotenv";
dotenv.config();
// binance config
// const baseUrl = "https://testnet.binancefuture.com/fapi/";
// const baseUrl = "https://fapi.binance.com/fapi/";

// const secret =
//   "4wTgPjsyA9z1FIyUug81SOuTzCP5pZNyD3wHoIHpkjQ8yzoKUXgLaiV5izztl5qp";
// const apiKey =
//   "1A0eAdDSYP6mamVZRCmc0cSt4qm4K7pwaONb55yTlIdfuHMUYmyztBZnSbZ3hPBb";

const baseUrl = process.env.BINANCE_BASE_URL;
const secret = process.env.BINANCE_SECRET;
const apiKey = process.env.BINANCE_API_KEY;
const sandBoxMode = process.env.BINANCE_SANDBOX_MODE;
const binance = new ccxt.binance({ apiKey, secret });
// binance.setSandboxMode(true);
binance.setSandboxMode(Boolean(sandBoxMode));

const fetchMyBalance = async () => {
  const balance = await binance.fetchBalance();
  return balance;
};
// get balance now
const getMyBalance = async () => {
  const balance = await binance.fetchBalance();
  let total = await calTotalToUsdt(balance);
  return total;
};

// assume that just have bitcoin and usdt in balance
async function calTotalToUsdt(balance: Balances) {
  const symbol = "BTCUSDT";
  let tickerBTCUSDT = await getTickerPrice(symbol);
  let totalBitcoin = balance.BTC.total * parseFloat(tickerBTCUSDT.price);
  let btc = balance.BTC.total;
  let usdt = balance.USDT.total;
  let totalByUSDT = {
    total: totalBitcoin + usdt,
    btc,
    usdt,
  };

  return totalByUSDT;
}

const tickerPriceUrl = `${baseUrl}/fapi/v2/ticker/price`;
type TTickerPrice = {
  symbol: string;
  price: string;
  time: number;
};
const getTickerPrice = async (symbol: string): Promise<TTickerPrice> => {
  const response = await axios.get(tickerPriceUrl, {
    params: { symbol },
  });
  const tickerPrice: TTickerPrice = response.data;
  return tickerPrice;
};

const getTickersPrice = async (): Promise<TTickerPrice[]> => {
  const response = await axios.get(tickerPriceUrl);
  const tickersPrice: TTickerPrice[] = response.data;
  return tickersPrice;
};

const getSymbolPriceNow = async (symbol: string): Promise<number> => {
  const symbolPrice = await getTickerPrice(symbol);
  if ("price" in symbolPrice) {
    return parseFloat(symbolPrice.price);
  }
};

const getSymbolClosePrice = async (symbol: string): Promise<TSymbolPrice> => {
  let price = 0;
  let timestamp = "";
  const ohlcv = await binance.fetchOHLCV(symbol, "1m", undefined, 1);
  if (ohlcv.length) {
    const lastOHLCV = ohlcv[0];
    if (lastOHLCV.length >= 5) {
      //[time, open, high, low, close, volum]
      timestamp = lastOHLCV[0].toString();
      price = lastOHLCV[4];
    }
  }
  return { timestamp, symbol, price };
};

const getAllSymbol = async () => {
  const tickersPrice = await getTickersPrice();
  const symbols = tickersPrice.map((ticker) => {
    return ticker.symbol;
  });
  return symbols;
};

const getSymbolsClosePrice = async (
  symbols: string[]
): Promise<TSymbolPrice[]> => {
  return Promise.all(
    symbols.map((symbol) => {
      return getSymbolClosePrice(symbol);
    })
  );
};

const getOrderHistory = async (symbol: string) => {
  const orders = await binance.fetchOrders(symbol);
  return orders;
};

const getTradeHistory = async (symbol: string) => {
  const tradeList = await binance.fetchMyTrades(symbol);
  return tradeList;
};

const createMarketOrder = async (
  symbol: string,
  side: "buy" | "sell",
  amount: number,
  price?: number
) => {
  const newMarketOrder = binance.createMarketOrder(symbol, side, amount, price);

  return newMarketOrder;
};

export default {
  getMyBalance,
  getTickerPrice,
  getTickersPrice,
  getOrderHistory,
  getTradeHistory,
  createMarketOrder,
  getSymbolPriceNow,
  getSymbolClosePrice,
  getSymbolsClosePrice,
  getAllSymbol,
  fetchMyBalance,
};
