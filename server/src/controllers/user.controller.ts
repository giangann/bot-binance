import IController from "IController";
import ccxt, { Balances } from "ccxt";
import { ServerResponse } from "../ultils/server-response.ultil";
// import crypto

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

const getBalance: IController = async (req, res) => {
  try {
    const balance = await binance.fetchBalance();

    let total = await calculateTotalToUSDTFake(balance);
    console.log("balance total", total);

    ServerResponse.response(res, total);
  } catch (err) {
    console.log(err);
  }
};

async function calculateTotalToUSDTFake(balance: Balances) {
  // assume that just have bitcoin and usdt
  let params = {
    symbol: "BTCUSDT",
  };
  let tickerBTCUSDT = await binance.fapiPublicV2GetTickerPrice(params);
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

const getOrderHistory: IController = async (req, res) => {
  try {
    // get list order id from order service in database
    const orders = await binance.fetchOrders("BTCUSDT");

    ServerResponse.response(res, orders);
  } catch (err) {
    ServerResponse.error(res, err.message);
  }
};

const getTradeHistory: IController = async (req, res) => {
  try {
    const tradeList = await binance.fetchMyTrades("BTCUSDT");
    ServerResponse.response(res, tradeList);
  } catch (err) {
    ServerResponse.error(res, err.message);
  }
};
async function getMyTrades() {
  try {
    let tradeList = await binance.fetchMyTrades("BTCUSDT");

    return tradeList;
  } catch (err) {
    console.log("err", err);
  }
}

async function orderIdsFromTradeList() {
  let orderIds: string[] = [];
  const tradeList = await getMyTrades();

  for (let trade of tradeList) {
    if (!orderIds.includes(trade.order)) orderIds.push(trade.order);
  }
  return orderIds;
}

// create new order with tradesize
const newOrder: IController = async (req, res) => {
  try {
    const { price: btcPrice } = await binance.fapiPublicV2GetTickerPrice({
      symbol: "BTCUSDT",
    });

    // const DOUBLE_PERCENT =
    const createdOrder = await binance.createLimitSellOrder(
      "BTCUSDT",
      TRADE_SIZE_BY_USDT / btcPrice,
      btcPrice - 5000
    );

    console.log("created order", createdOrder);
  } catch (err) {
    ServerResponse.error(res, err.message);
  }
};

// check condition to decide update order
async function updateOrder(orderId: string) {
  try {
    let updatedOrder = await binance.editLimitBuyOrder(
      orderId,
      "BTCUSDT",
      0.005,
      59000
    );
    console.log("updatedOrder", updatedOrder);
  } catch (err) {
    console.log("err", err);
  }
}
// updateOrder("782912");
async function calculateOrderValue(orderId: string) {}

async function makeLimitOrder() {
  const { price: btcPrice } = await binance.fapiPublicV2GetTickerPrice({
    symbol: "BTCUSDT",
  });
  const newOrder = await binance.createLimitBuyOrder(
    "BTCUSDT",
    TRADE_SIZE_BY_USDT / btcPrice,
    59000 //if down 500$ then buy
  );
  console.log("newOrder: ", newOrder);
}
// makeLimitOrder();

export default { getBalance, getOrderHistory, getTradeHistory, newOrder };
