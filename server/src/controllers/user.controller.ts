import IController from "IController";
import binanceService from "../services/binance.service";
import { ServerResponse } from "../ultils/server-response.ultil";

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

const getAccInfo: IController = async (req, res) => {
  try {
    const accInfo = await binanceService.getAccountInfo();
    ServerResponse.response(res, accInfo);
  } catch (err) {
    ServerResponse.error(res, err.message);
  }
};

const getPosition: IController = async (req, res) => {
  // get position from binance service
  const positions = await binanceService.getPositions();
  ServerResponse.response(res, positions);
  try {
  } catch (err) {
    ServerResponse.error(res, err.message);
  }
};

export default {
  getOrderHistory,
  getTradeHistory,
  getAccInfo,
  getPosition,
};
