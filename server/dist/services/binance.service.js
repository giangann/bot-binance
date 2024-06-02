"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
const error_handler_ultil_1 = require("../ultils/error-handler.ultil");
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
    headers: { ...commonHeader },
    validateStatus: (_status) => (0, helper_ultil_1.isSuccess)(_status),
};
const coinService = new coin_service_1.default(baseUrl.includes("testnet") ? true : false);
const getExchangeInfo = async () => {
const getExchangeInfo = async () => {
    try {
        const endpoint = "/fapi/v1/exchangeInfo";
        const url = `${baseUrl}${endpoint}`;
        const response = await axios_1.default.get(url, commonAxiosOpt);
        const response = await axios_1.default.get(url, commonAxiosOpt);
        const exchangeInfo = response.data;
        return exchangeInfo;
    }
    catch (err) {
        (0, error_handler_ultil_1.throwError)(err);
    }
};
const getPositions = async () => {
};
const getPositions = async () => {
    try {
        const paramsNow = { recvWindow: 10000, timestamp: Date.now() };
        const queryString = (0, helper_ultil_1.paramsToQueryWithSignature)(secret, paramsNow);
        const endpoint = "/fapi/v2/positionRisk";
        const url = `${baseUrl}${endpoint}?${queryString}`;
        const response = await axios_1.default.get(url, commonAxiosOpt);
        const response = await axios_1.default.get(url, commonAxiosOpt);
        const positions = response.data;
        return (0, helper_ultil_1.filterAblePosition)(positions);
    }
    catch (err) {
        (0, error_handler_ultil_1.throwError)(err);
    }
};
const getAccountInfo = async () => {
};
const getAccountInfo = async () => {
    try {
        const endpoint = "/fapi/v2/account";
        const paramsNow = { recvWindow: 10000, timestamp: Date.now() };
        const queryString = (0, helper_ultil_1.paramsToQueryWithSignature)(secret, paramsNow);
        const url = `${baseUrl}${endpoint}?${queryString}`;
        const response = await axios_1.default.get(url, commonAxiosOpt);
        const response = await axios_1.default.get(url, commonAxiosOpt);
        const accInfo = response.data;
        return accInfo;
    }
    catch (err) {
        (0, error_handler_ultil_1.throwError)(err);
    }
};
const getAccountFetch = async () => {
};
const getAccountFetch = async () => {
    try {
        const endpoint = "/fapi/v2/account";
        const paramsNow = { recvWindow: 10000, timestamp: Date.now() };
        const queryString = (0, helper_ultil_1.paramsToQueryWithSignature)(secret, paramsNow);
        const url = `${baseUrl}${endpoint}?${queryString}`;
        const response = await fetch(url, {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "X-MBX-APIKEY": apiKey,
                "Content-Type": "application/json",
            },
        });
        const accInfo = await response.json();
        const accInfo = await response.json();
        return accInfo;
    }
    catch (err) {
        (0, error_handler_ultil_1.throwError)(err);
    }
};
const getSymbolPriceTickers1Am = async () => {
};
const getSymbolPriceTickers1Am = async () => {
    try {
        const price1Am = await coinService.list();
        const price1Am = await coinService.list();
        return price1Am;
    }
    catch (err) {
        (0, error_handler_ultil_1.throwError)(err);
    }
};
const getSymbolPriceTicker = async (symbol) => {
    try {
        const endpoint = "/fapi/v2/ticker/price";
        const url = `${baseUrl}${endpoint}`;
        const response = await axios_1.default.get(url, {
            params: { symbol },
        });
        const tickerPrice = response.data;
        return tickerPrice;
    }
    catch (err) {
        (0, error_handler_ultil_1.throwError)(err);
    }
};
const getSymbolPriceTickers = async () => {
    try {
        const endpoint = "/fapi/v2/ticker/price";
        const url = `${baseUrl}${endpoint}`;
        const response = await axios_1.default.get(url);
        const tickersPrice = response.data;
        return tickersPrice;
    }
    catch (err) {
        (0, error_handler_ultil_1.throwError)(err);
    }
};
const getSymbolMarketPrices = async () => {
    try {
        const endpoint = "/fapi/v1/premiumInde";
        const url = `${baseUrl}${endpoint}`;
        const response = await axios_1.default.get(url);
        const markPrices = response.data;
        return markPrices;
    }
    catch (err) {
        (0, error_handler_ultil_1.throwError)(err);
    }
};
const createMarketOrder = async (symbol, side, quantity, type = "market", _price) => {
    try {
        const endpoint = "/fapi/v1/order";
        const paramsNow = { recvWindow: 10000, timestamp: Date.now() };
        let orderParams = {
            symbol,
        let orderParams = {
            symbol,
            type,
            quantity,
            side,
            ...paramsNow,
        };
            side,
            ...paramsNow,
        };
        const queryString = (0, helper_ultil_1.paramsToQueryWithSignature)(secret, orderParams);
        const response = await fetch(`${baseUrl}${endpoint}?${queryString}`, {
        const response = await fetch(`${baseUrl}${endpoint}?${queryString}`, {
            method: "POST",
            headers: {
                "X-MBX-APIKEY": apiKey,
                "Content-Type": "application/json",
            },
        });
        if (response.status === 200 || response.status === 201) {
            const data = await response.json();
            const data = await response.json();
            return {
                success: true,
                data: data,
            };
        }
        else {
            const err = await response.json();
            const err = await response.json();
            return {
                success: false,
                error: err,
                payload: orderParams,
            };
        }
    }
    catch (err) {
        (0, error_handler_ultil_1.throwError)(err);
    }
};
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
    getAccountFetch,
};
