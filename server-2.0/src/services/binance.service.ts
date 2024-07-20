import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import {
  TResponse,
  TSymbolMarketPrice,
  TSymbolTickerPrice,
} from "../types/rest-api";
import { TAccount } from "../types/rest-api/account.type";
import { TExchangeInfo } from "../types/rest-api/exchange-info.type";
import { TPosition } from "../types/rest-api/position.type";
import {
  generateSignature,
  paramsToQueryWithSignature,
} from "../ultils/helper";
import { TNewOrder } from "../types/rest-api/order.type";
import loggerService from "./logger.service";
dotenv.config();

const apiKey = process.env.BINANCE_API_KEY;
const apiSecret = process.env.BINANCE_API_SECRET;

const getExchangeInfo = async (): Promise<TExchangeInfo> => {
  const endpoint = "/fapi/v1/exchangeInfo";
  const url = `${process.env.BINANCE_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "X-MBX-APIKEY": apiKey,
      "Content-Type": "application/json",
    },
  });
  const responseJson: TResponse<TExchangeInfo> = await response.json();

  if (response.status !== 200) {
    throw new Error(JSON.stringify(responseJson));
  }
  if (response.status === 200) {
    return responseJson as TExchangeInfo;
  }
};

const getPositions = async (): Promise<TPosition[]> => {
  const endpoint = "/fapi/v2/positionRisk";
  const paramsNow = { recvWindow: 20000, timestamp: Date.now() };

  const queryString = paramsToQueryWithSignature(apiSecret, paramsNow);
  const url = `${process.env.BINANCE_BASE_URL}${endpoint}?${queryString}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "X-MBX-APIKEY": apiKey,
      "Content-Type": "application/json",
    },
  });
  const responseJson: TResponse<TPosition[]> = await response.json();

  if (response.status !== 200) {
    throw new Error(JSON.stringify(responseJson));
  }
  if (response.status === 200) {
    return responseJson as TPosition[];
  }
};

const getAccountInfo = async (): Promise<TAccount> => {
  const endpoint = "/fapi/v2/account";
  const paramsNow = { recvWindow: 20000, timestamp: Date.now() };
  const queryString = paramsToQueryWithSignature(apiSecret, paramsNow);
  const url = `${process.env.BINANCE_BASE_URL}${endpoint}?${queryString}`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "X-MBX-APIKEY": apiKey,
      "Content-Type": "application/json",
    },
  });
  const responseJson: TResponse<TAccount> = await response.json();

  if (response.status !== 200) {
    throw new Error(JSON.stringify(responseJson));
  }
  if (response.status === 200) {
    return responseJson as TAccount;
  }
};

const getSymbolTickerPrices = async (): Promise<TSymbolTickerPrice[]> => {
  const endpoint = "/fapi/v2/ticker/price";
  const url = `${process.env.BINANCE_BASE_URL}${endpoint}`;
  const response = await fetch(url);
  const responseJson: TResponse<TSymbolTickerPrice[]> = await response.json();

  if (response.status !== 200) {
    throw new Error(JSON.stringify(responseJson));
  }
  if (response.status === 200) {
    return responseJson as TSymbolTickerPrice[];
  }
};

const getSymbolMarketPrices = async (): Promise<TSymbolMarketPrice[]> => {
  const endpoint = "/fapi/v1/premiumIndex";
  const response = await fetch(`${process.env.BINANCE_BASE_URL}${endpoint}`);
  const responseJson: TResponse<TSymbolMarketPrice[]> = await response.json();

  if (response.status !== 200) {
    throw new Error(JSON.stringify(responseJson));
  }
  if (response.status === 200) {
    return responseJson as TSymbolMarketPrice[];
  }
};

const placeOrderWebsocket = (
  symbol: string,
  quantity: number,
  side: "SELL" | "BUY",
  cb?: (uuid: string) => void
) => {
  const orderParams: Record<string, unknown> = {
    apiKey: apiKey,
    quantity: quantity.toString(),
    recvWindow: 5000,
    side: side,
    symbol: symbol,
    timestamp: Date.now(),
    type: "MARKET",
  };

  // Generate the signature
  const signature = generateSignature(orderParams, apiSecret || "");
  orderParams.signature = signature;

  // Create request payload
  const requestPayload = {
    id: uuidv4(), // Arbitrary ID
    method: "order.place", // Request method name
    params: orderParams,
  };

  //
  if (cb) {
    cb(requestPayload.id);
  }

  // Send request
  global.orderPlaceWsConnection.send(JSON.stringify(requestPayload));

  return requestPayload.id;
};

const closePositionWebSocket = (
  symbol: string,
  quantity: number,
  side = "SELL"
) => {
  const orderParams: Record<string, unknown> = {
    apiKey: apiKey,
    quantity: quantity.toString(),
    recvWindow: 5000,
    side: side,
    symbol: symbol,
    timestamp: Date.now(),
    type: "MARKET",
  };
  // Generate the signature
  const signature = generateSignature(orderParams, apiSecret || "");
  orderParams.signature = signature;

  // Create request payload
  const requestPayload = {
    id: uuidv4(), // Arbitrary ID
    method: "order.place", // Request method name
    params: orderParams,
  };

  // Send request
  global.closePositionsWsConnection.send(JSON.stringify(requestPayload));
};

const updatePositionsWebsocket = () => {
  const params: Record<string, unknown> = {
    apiKey: apiKey,
    recvWindow: 5000,
    timestamp: Date.now(),
  };
  const signature = generateSignature(params, apiSecret || "");
  params.signature = signature;

  const requestPayload = {
    id: uuidv4(), // Arbitrary ID
    method: "account.position", // Request method name
    params: params,
  };
  global.updatePositionsWsConnection.send(JSON.stringify(requestPayload));
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
    const paramsNow = { recvWindow: 20000, timestamp: Date.now() };
    let orderParams = {
      symbol,
      type,
      quantity,
      side,
      ...paramsNow,
    };
    const queryString = paramsToQueryWithSignature(apiSecret, orderParams);
    const url = `${process.env.BINANCE_BASE_URL}${endpoint}?${queryString}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "X-MBX-APIKEY": apiKey,
        "Content-Type": "application/json",
      },
    });
    const responseJson = await response.json()

    if (response.status !== 200) {
      throw new Error(JSON.stringify(responseJson));
    }
    if (response.status === 200) {
      return responseJson as TNewOrder;
    }
  } catch (err) {
    loggerService.saveError(err);
  }
};

export {
  getExchangeInfo,
  getPositions,
  getAccountInfo,
  getSymbolTickerPrices,
  getSymbolMarketPrices,
  placeOrderWebsocket,
  updatePositionsWebsocket,
  closePositionWebSocket,
  createMarketOrder
};
