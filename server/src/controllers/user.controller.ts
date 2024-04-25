import IController from "IController";
import binanceService from "../services/binance.service";
import { ServerResponse } from "../ultils/server-response.ultil";

// constant
const TRADE_SIZE_BY_USDT = 100;
const DOUBLE_PERCENT = 5 / 100;
const STOP_PERCENT = 2.5 / 100;

const getBalance: IController = async (req, res) => {
  try {
    // const balance = await binanceService.fetchMyBalance();

    // update balance realtime each 5s
    // setInterval(async () => {
    //   const balance = await binanceService.getMyBalance();
    //   const { total, btc, usdt } = balance;
    //   global.wsServerGlob.emit("ws-balance", total, btc, usdt);
    // }, 5000);
    
    // ServerResponse.response(res, balance);
  } catch (err) {
    console.log(err.message);
  }
};

const getOrderHistory: IController = async (req, res) => {
  try {
    // get list order id from order service in database
    // const orders = await binanceService.getOrderHistory("BTCUSDT");

    // ServerResponse.response(res, orders);
  } catch (err) {
    ServerResponse.error(res, err.message);
  }
};

const getTradeHistory: IController = async (req, res) => {
  try {
    // const tradeList = await binanceService.getTradeHistory("BTCUSDT");
    // ServerResponse.response(res, tradeList);
  } catch (err) {
    ServerResponse.error(res, err.message);
  }
};

export default { getBalance, getOrderHistory, getTradeHistory };
