import IController from "IController";
import axios from "axios";
import ccxt from "ccxt";
import { Balances } from "ccxt";
import crypto from "node:crypto";
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
const TRADE_SIZE_BY_USDT = 0.01;

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
    let listOrderId = await orderIdsFromTradeList();
    // promise.all list order to get list promise of api banance all fetchOrder(orderId)

    let orders = await Promise.all(
      listOrderId.map(async (order_id) => {
        return await binance.fetchOrder(order_id, "BTCUSDT");
      })
    );

    ServerResponse.response(res, orders);
  } catch (err) {
    ServerResponse.error(res, err.message);
  }
};

const getTradeHistory: IController = async (req, res) => {
  try {
    const tradeList = await binance.fetchMyTrades("BTCUSDT");
    // const tradeList = response.map((trade) => {
    //   return {
    //     order_id: trade.order,
    //     amount: trade.amount,
    //     price: trade.price,
    //     datetime: trade.datetime,
    //   };
    // });
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

export default { getBalance, getOrderHistory, getTradeHistory };
