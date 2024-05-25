"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importStar(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
const helper_ultil_1 = require("../ultils/helper.ultil");
const coin_service_1 = __importDefault(require("./coin.service"));
dotenv_1.default.config();
// GET ENV
const baseUrl = process.env.BINANCE_BASE_URL;
const secret = process.env.BINANCE_SECRET;
const apiKey = process.env.BINANCE_API_KEY;
// CONSTANT
const commonHeader = {
    "X-MBX-APIKEY": apiKey,
};
const commonAxiosOpt = {
    headers: { ...commonHeader },
    validateStatus: (_status) => (0, helper_ultil_1.isSuccess)(_status),
};
const coinService = new coin_service_1.default(baseUrl.includes("testnet") ? true : false);
const getExchangeInfo = async () => {
    try {
        const endpoint = "/fapi/v1/exchangeInfo";
        const url = `${baseUrl}${endpoint}`;
        const response = await axios_1.default.get(url, commonAxiosOpt);
        const exchangeInfo = response.data;
        return exchangeInfo;
    }
    catch (err) {
        if (err instanceof axios_1.AxiosError) {
            throw new Error(JSON.stringify(err.response.data));
        }
        else {
            throw err;
        }
    }
};
const getPositions = async () => {
    try {
        const paramsNow = { recvWindow: 10000, timestamp: Date.now() };
        const queryString = (0, helper_ultil_1.paramsToQueryWithSignature)(secret, paramsNow);
        const endpoint = "/fapi/v2/positionRisk";
        const url = `${baseUrl}${endpoint}?${queryString}`;
        const response = await axios_1.default.get(url, commonAxiosOpt);
        const positions = response.data;
        return (0, helper_ultil_1.filterAblePosition)(positions);
    }
    catch (err) {
        if (err instanceof axios_1.AxiosError) {
            throw new Error(JSON.stringify(err.response.data));
        }
        else {
            throw err;
        }
    }
};
const getAccountInfo = async () => {
    try {
        const endpoint = "/fapi/v2/account";
        const paramsNow = { recvWindow: 10000, timestamp: Date.now() };
        const queryString = (0, helper_ultil_1.paramsToQueryWithSignature)(secret, paramsNow);
        const url = `${baseUrl}${endpoint}?${queryString}`;
        const response = await axios_1.default.get(url, commonAxiosOpt);
        const accInfo = response.data;
        return accInfo;
    }
    catch (err) {
        if (err instanceof axios_1.AxiosError) {
            throw new Error(JSON.stringify(err.response.data));
        }
        else {
            throw err;
        }
    }
};
const getAccountFetch = async () => {
    try {
        const endpoint = "/fapi/v2/account";
        const paramsNow = { recvWindow: 10000, timestamp: Date.now() };
        const queryString = (0, helper_ultil_1.paramsToQueryWithSignature)(secret, paramsNow);
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
    }
    catch (err) {
        if (err instanceof axios_1.AxiosError) {
            throw new Error(JSON.stringify(err.response.data));
        }
        else {
            throw err;
        }
    }
};
const getSymbolPriceTickers1Am = async () => {
    try {
        const price1Am = await coinService.list();
        return price1Am;
    }
    catch (error) {
        throw error;
    }
};
const getSymbolPriceTicker = async (symbol) => {
    const endpoint = "/fapi/v2/ticker/price";
    const url = `${baseUrl}${endpoint}`;
    const response = await axios_1.default.get(url, {
        params: { symbol },
    });
    const tickerPrice = response.data;
    return tickerPrice;
};
const getSymbolPriceTickers = async () => {
    const endpoint = "/fapi/v2/ticker/price";
    const url = `${baseUrl}${endpoint}`;
    const response = await axios_1.default.get(url);
    const tickersPrice = response.data;
    return tickersPrice;
};
const getSymbolMarketPrices = async () => {
    const endpoint = "/fapi/v1/premiumIndex";
    const url = `${baseUrl}${endpoint}`;
    const response = await axios_1.default.get(url);
    const markPrices = response.data;
    return markPrices;
};
const getOrdersFromToday1Am = async () => {
    try {
        const endpoint = "/fapi/v1/allOrders";
        const paramsNow = { recvWindow: 10000, timestamp: Date.now() };
        const params = {
            ...paramsNow,
            startTime: (0, helper_ultil_1.getTimestampOfToday1AM)(),
        };
        const queryString = (0, helper_ultil_1.paramsToQueryWithSignature)(secret, params);
        const url = `${baseUrl}${endpoint}?${queryString}`;
        const response = await axios_1.default.get(url, commonAxiosOpt);
        const orders = response.data;
        return orders;
    }
    catch (error) {
        // Handle the error here
        throw error; // Re-throw the error if necessary
    }
};
// phep thu tren server
// ghi 100 record vao database
const createMarketOrder = async (symbol, side, quantity, type = "market", _price) => {
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
        const queryString = (0, helper_ultil_1.paramsToQueryWithSignature)(secret, orderParams);
        const response = await fetch(`${baseUrl}${endpoint}?${queryString}`, {
            method: "POST",
            headers: {
                "X-MBX-APIKEY": apiKey,
                "Content-Type": "application/json",
            },
        });
        if (response.status === 200 || response.status === 201) {
            const data = await response.json();
            return {
                success: true,
                data: data,
            };
        }
        else {
            const err = await response.json();
            return {
                success: false,
                error: err,
                payload: orderParams,
            };
        }
    }
    catch (err) {
        if (err instanceof Error) {
            throw new Error(err.message, {
                cause: "binanceService createMarketOrder",
            });
        }
        else
            throw err;
    }
};
exports.default = {
    getSymbolPriceTicker,
    getSymbolPriceTickers,
    getSymbolMarketPrices,
    createMarketOrder,
    getSymbolPriceTickers1Am,
    getPositions,
    getExchangeInfo,
    getAccountInfo,
    getOrdersFromToday1Am,
    getAccountFetch,
};
