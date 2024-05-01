import axios, { AxiosRequestConfig } from "axios";
import dotenv from "dotenv";
import { TAccount } from "../types/account";
import { TCreateOrderErr, TNewOrder, TOrder, TResponse } from "../types/order";
import { TPosition } from "../types/position";
import { TSymbolPriceTicker } from "../types/symbol-price-ticker";
import {
  getTimestampOfToday1AM,
  paramsToQueryWithSignature,
} from "../ultils/helper.ultil";
import CoinService from "./coin.service";
import { TSymbolMarkPrice } from "../types/symbol-mark-price";
dotenv.config();

// GET ENV
const baseUrl = process.env.BINANCE_BASE_URL;
const secret = process.env.BINANCE_SECRET;
const apiKey = process.env.BINANCE_API_KEY;

// CONSTANT
const commonHeader = {
  "X-MBX-APIKEY": apiKey,
};
const commonAxiosOpt: AxiosRequestConfig = {
  headers: { ...commonHeader },
};
const coinService = new CoinService(true)

const getPositions = async (): Promise<TPosition[]> => {
  const paramsNow = { recvWindow: 10000, timestamp: Date.now() };
  const queryString = paramsToQueryWithSignature(secret, paramsNow);
  const endpoint = "/fapi/v2/positionRisk";
  const url = `${baseUrl}${endpoint}?${queryString}`;
  const response = await axios.get(url, commonAxiosOpt);
  const positions = response.data;
  return positions;
};

const getAccountInfo = async (): Promise<TAccount> => {
  const endpoint = "/fapi/v2/account";
  const paramsNow = { recvWindow: 10000, timestamp: Date.now() };
  const queryString = paramsToQueryWithSignature(secret, paramsNow);
  const url = `${baseUrl}${endpoint}?${queryString}`;
  const response = await axios.get(url, commonAxiosOpt);
  const accInfo = response.data;
  return accInfo;
};

const getAccountFetch = async (): Promise<TAccount> => {
  const endpoint = "/fapi/v2/account";
  const paramsNow = { recvWindow: 10000, timestamp: Date.now() };
  const queryString = paramsToQueryWithSignature(secret, paramsNow);
  const url = `${baseUrl}${endpoint}?${queryString}`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "X-MBX-APIKEY": apiKey,
      "Content-Type": "application/json",
    },
  });
  const accInfo = await response.json();
  return accInfo;
};

const getSymbolPriceTickers1Am = async (): Promise<
  Omit<TSymbolPriceTicker, "time">[]
> => {
  const price1Am = await coinService.list();
  return price1Am;
};

const getSymbolPriceTicker = async (
  symbol: string
): Promise<TSymbolPriceTicker> => {
  const endpoint = "/fapi/v2/ticker/price";
  const url = `${baseUrl}${endpoint}`;
  const response = await axios.get(url, {
    params: { symbol },
  });
  const tickerPrice: TSymbolPriceTicker = response.data;
  return tickerPrice;
};

const getSymbolPriceTickers = async (): Promise<TSymbolPriceTicker[]> => {
  const endpoint = "/fapi/v2/ticker/price";
  const url = `${baseUrl}${endpoint}`;
  const response = await axios.get(url);
  const tickersPrice: TSymbolPriceTicker[] = response.data;
  return tickersPrice;
};

const getSymbolMarketPrices = async (): Promise<TSymbolMarkPrice[]> => {
  const endpoint = "/fapi/v1/premiumIndex";
  const url = `${baseUrl}${endpoint}`;
  const response = await axios.get(url);
  const markPrices: TSymbolMarkPrice[] = response.data;
  return markPrices;
};

const test = async () => {
  const data = await getSymbolPriceTickers();
  console.log("some info", data.slice(0, 10));
};
// test();

const getOrdersFromToday1Am = async (): Promise<TOrder[]> => {
  const endpoint = "/fapi/v1/allOrders";
  const paramsNow = { recvWindow: 10000, timestamp: Date.now() };
  const params = {
    ...paramsNow,
    startTime: getTimestampOfToday1AM(),
  };
  const queryString = paramsToQueryWithSignature(secret, params);
  const url = `${baseUrl}${endpoint}?${queryString}`;
  const response = await axios.get(url, commonAxiosOpt);
  const orders = response.data;

  return orders;
};

const createMarketOrder = async (
  symbol: string,
  side: "BUY" | "SELL",
  quantity: number,
  type: string = "market",
  _price?: number
): Promise<TResponse<TNewOrder>> => {
  try {
    const endpoint = "/fapi/v1/order";
    const paramsNow = { recvWindow: 10000, timestamp: Date.now() };
    let orderParams = {
      symbol,
      type,
      quantity,
      side,
      ...paramsNow,
    };
    const queryString = paramsToQueryWithSignature(secret, orderParams);
    const response = await fetch(`${baseUrl}${endpoint}?${queryString}`, {
      method: "POST",
      headers: {
        "X-MBX-APIKEY": apiKey,
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200 || response.status === 201) {
      const data: TNewOrder = await response.json();
      return {
        success: true,
        data: data,
      };
    } else {
      const err: TCreateOrderErr = await response.json();
      return {
        success: false,
        error: err,
        payload: orderParams,
      };
    }
  } catch (err) {
    console.log("err msg", err);
  }
};

export default {
  getSymbolPriceTicker,
  getSymbolPriceTickers,
  getSymbolMarketPrices,
  createMarketOrder,
  getSymbolPriceTickers1Am,
  getPositions,
  getAccountInfo,
  getOrdersFromToday1Am,
  getAccountFetch,
};
