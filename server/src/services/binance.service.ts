import IController from "IController";
import ccxt, { Balances } from "ccxt";

// binance config
const secret =
  "4wTgPjsyA9z1FIyUug81SOuTzCP5pZNyD3wHoIHpkjQ8yzoKUXgLaiV5izztl5qp";
const apiKey =
  "1A0eAdDSYP6mamVZRCmc0cSt4qm4K7pwaONb55yTlIdfuHMUYmyztBZnSbZ3hPBb";
const binance = new ccxt.binance({ apiKey, secret });
binance.setSandboxMode(true);

// constant
const TRADE_SIZE_BY_USDT = 100;
const DOUBLE_PERCENT = 5 / 100;
const STOP_PERCENT = 2.5 / 100;

const getMyBalance = async () => {
  const balance = await binance.fetchBalance();
  let total = await calTotalToUsdt(balance);
  return total;
};

// assume that just have bitcoin and usdt in balance
async function calTotalToUsdt(balance: Balances) {
  let params = {
    symbol: "BTCUSDT",
  };
  let tickerBTCUSDT = await getTickerPrice(params);
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

const getTickerPrice = async (params: { symbol: string }) => {
  const tickerPrice = await binance.fapiPublicV2GetTickerPrice(params);
  return tickerPrice;
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
  getOrderHistory,
  getTradeHistory,
  createMarketOrder,
};
