import axios, { AxiosRequestConfig } from "axios";
import dotenv from "dotenv";
import { TAccount } from "../types/account";
import { TExchangeInfo } from "../types/exchange-info";
import { TCreateOrderErr, TNewOrder, TResponse } from "../types/order";
import { TPosition } from "../types/position";
import { TSymbolMarkPrice } from "../types/symbol-mark-price";
import { TSymbolPriceTicker } from "../types/symbol-price-ticker";
import { throwError } from "../ultils/error-handler.ultil";
import {
  filterAblePosition,
  isSuccess,
  paramsToQueryWithSignature
} from "../ultils/helper.ultil";
import CoinService from "./coin.service";
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
  validateStatus: (_status) => isSuccess(_status),
};
const coinService = new CoinService(baseUrl.includes("testnet") ? true : false);

const getExchangeInfo = async (): Promise<TExchangeInfo> => {
  try {
    const endpoint = "/fapi/v1/exchangeInfo";
    const url = `${baseUrl}${endpoint}`;
    const response = await axios.get(url, commonAxiosOpt);
    const exchangeInfo: TExchangeInfo = response.data;
    return exchangeInfo;
  } catch (err) {
    throwError(err);
  }
};

const getPositions = async (): Promise<TPosition[]> => {
  try {
    const paramsNow = { recvWindow: 10000, timestamp: Date.now() };
    const queryString = paramsToQueryWithSignature(secret, paramsNow);
    const endpoint = "/fapi/v2/positionRisk";
    const url = `${baseUrl}${endpoint}?${queryString}`;
    const response = await axios.get(url, commonAxiosOpt);
    const positions: TPosition[] = response.data;
    return filterAblePosition(positions);
  } catch (err) {
    throwError(err);
  }
};

const getAccountInfo = async (): Promise<TAccount> => {
  try {
    const endpoint = "/fapi/v2/account";
    const paramsNow = { recvWindow: 10000, timestamp: Date.now() };
    const queryString = paramsToQueryWithSignature(secret, paramsNow);
    const url = `${baseUrl}${endpoint}?${queryString}`;
    const response = await axios.get(url, commonAxiosOpt);

    const accInfo = response.data;
    return accInfo;
  } catch (err) {
    throwError(err);
  }
};
const getAccountFetch = async (): Promise<TAccount> => {
  try {
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
  } catch (err) {
    throwError(err);
  }
};

const getSymbolPriceTickers1Am = async (): Promise<
  Omit<TSymbolPriceTicker, "time">[]
> => {
  try {
    const price1Am = await coinService.list();
    return price1Am;
  } catch (err) {
    throwError(err);
  }
};

const getSymbolPriceTicker = async (
  symbol: string
): Promise<TSymbolPriceTicker> => {
  try {
    const endpoint = "/fapi/v2/ticker/price";
    const url = `${baseUrl}${endpoint}`;
    const response = await axios.get(url, {
      params: { symbol },
    });
    const tickerPrice: TSymbolPriceTicker = response.data;
    return tickerPrice;
  } catch (err) {
    throwError(err);
  }
};

const getSymbolPriceTickers = async (): Promise<TSymbolPriceTicker[]> => {
  try {
    const endpoint = "/fapi/v2/ticker/price";
    const url = `${baseUrl}${endpoint}`;
    const response = await axios.get(url);
    const tickersPrice: TSymbolPriceTicker[] = response.data;
    return tickersPrice;
  } catch (err) {
    throwError(err);
  }
};

const getSymbolMarketPrices = async (): Promise<TSymbolMarkPrice[]> => {
  try {
    const endpoint = "/fapi/v1/premiumInde";
    const url = `${baseUrl}${endpoint}`;
    const response = await axios.get(url);
    const markPrices: TSymbolMarkPrice[] = response.data;
    return markPrices;
  } catch (err) {
    throwError(err);
  }
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
    throwError(err);
  }
};

export default {
  getSymbolPriceTicker,
  getSymbolPriceTickers,
  getSymbolMarketPrices,
  createMarketOrder,
  getSymbolPriceTickers1Am,
  getPositions,
  getExchangeInfo,
  getAccountInfo,
  getAccountFetch,
};
