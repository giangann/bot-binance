"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMarketOrder = exports.closePositionWebSocket = exports.updatePositionsWebsocket = exports.placeOrderWebsocket = exports.getSymbolMarketPrices = exports.getSymbolTickerPrices = exports.getAccountInfo = exports.getPositions = exports.getExchangeInfo = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const uuid_1 = require("uuid");
const helper_1 = require("../ultils/helper");
const logger_service_1 = __importDefault(require("./logger.service"));
dotenv_1.default.config();
const WEBSOCKET_API_URL = "wss://testnet.binancefuture.com/ws-fapi/v1";
const apiKey = process.env.BINANCE_API_KEY;
const apiSecret = process.env.BINANCE_API_SECRET;
const getExchangeInfo = async () => {
    const endpoint = "/fapi/v1/exchangeInfo";
    const url = `${process.env.BINANCE_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "X-MBX-APIKEY": apiKey,
            "Content-Type": "application/json",
        },
    });
    const responseJson = await response.json();
    if (response.status !== 200) {
        throw new Error(JSON.stringify(responseJson));
    }
    if (response.status === 200) {
        return responseJson;
    }
};
exports.getExchangeInfo = getExchangeInfo;
const getPositions = async () => {
    const endpoint = "/fapi/v2/positionRisk";
    const paramsNow = { recvWindow: 20000, timestamp: Date.now() };
    const queryString = (0, helper_1.paramsToQueryWithSignature)(apiSecret, paramsNow);
    const url = `${process.env.BINANCE_BASE_URL}${endpoint}?${queryString}`;
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "X-MBX-APIKEY": apiKey,
            "Content-Type": "application/json",
        },
    });
    const responseJson = await response.json();
    if (response.status !== 200) {
        throw new Error(JSON.stringify(responseJson));
    }
    if (response.status === 200) {
        return responseJson;
    }
};
exports.getPositions = getPositions;
const getAccountInfo = async () => {
    const endpoint = "/fapi/v2/account";
    const paramsNow = { recvWindow: 20000, timestamp: Date.now() };
    const queryString = (0, helper_1.paramsToQueryWithSignature)(apiSecret, paramsNow);
    const url = `${process.env.BINANCE_BASE_URL}${endpoint}?${queryString}`;
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "X-MBX-APIKEY": apiKey,
            "Content-Type": "application/json",
        },
    });
    const responseJson = await response.json();
    if (response.status !== 200) {
        throw new Error(JSON.stringify(responseJson));
    }
    if (response.status === 200) {
        return responseJson;
    }
};
exports.getAccountInfo = getAccountInfo;
const getSymbolTickerPrices = async () => {
    const endpoint = "/fapi/v2/ticker/price";
    const url = `${process.env.BINANCE_BASE_URL}${endpoint}`;
    const response = await fetch(url);
    const responseJson = await response.json();
    if (response.status !== 200) {
        throw new Error(JSON.stringify(responseJson));
    }
    if (response.status === 200) {
        return responseJson;
    }
};
exports.getSymbolTickerPrices = getSymbolTickerPrices;
const getSymbolMarketPrices = async () => {
    const endpoint = "/fapi/v1/premiumIndex";
    const response = await fetch(`${process.env.BINANCE_BASE_URL}${endpoint}`);
    const responseJson = await response.json();
    if (response.status !== 200) {
        throw new Error(JSON.stringify(responseJson));
    }
    if (response.status === 200) {
        return responseJson;
    }
};
exports.getSymbolMarketPrices = getSymbolMarketPrices;
const placeOrderWebsocket = (symbol, quantity, side, cb) => {
    const orderParams = {
        apiKey: apiKey,
        quantity: quantity.toString(),
        recvWindow: 5000,
        side: side,
        symbol: symbol,
        timestamp: Date.now(),
        type: "MARKET",
    };
    // Generate the signature
    const signature = (0, helper_1.generateSignature)(orderParams, apiSecret || "");
    orderParams.signature = signature;
    // Create request payload
    const requestPayload = {
        id: (0, uuid_1.v4)(), // Arbitrary ID
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
exports.placeOrderWebsocket = placeOrderWebsocket;
const closePositionWebSocket = (symbol, quantity, side = "SELL") => {
    const orderParams = {
        apiKey: apiKey,
        quantity: quantity.toString(),
        recvWindow: 5000,
        side: side,
        symbol: symbol,
        timestamp: Date.now(),
        type: "MARKET",
    };
    // Generate the signature
    const signature = (0, helper_1.generateSignature)(orderParams, apiSecret || "");
    orderParams.signature = signature;
    // Create request payload
    const requestPayload = {
        id: (0, uuid_1.v4)(), // Arbitrary ID
        method: "order.place", // Request method name
        params: orderParams,
    };
    // Send request
    global.closePositionsWsConnection.send(JSON.stringify(requestPayload));
};
exports.closePositionWebSocket = closePositionWebSocket;
const updatePositionsWebsocket = () => {
    const params = {
        apiKey: apiKey,
        recvWindow: 5000,
        timestamp: Date.now(),
    };
    const signature = (0, helper_1.generateSignature)(params, apiSecret || "");
    params.signature = signature;
    const requestPayload = {
        id: (0, uuid_1.v4)(), // Arbitrary ID
        method: "account.position", // Request method name
        params: params,
    };
    global.updatePositionsWsConnection.send(JSON.stringify(requestPayload));
};
exports.updatePositionsWebsocket = updatePositionsWebsocket;
const createMarketOrder = async (symbol, side, quantity, type = "market", _price) => {
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
        const queryString = (0, helper_1.paramsToQueryWithSignature)(apiSecret, orderParams);
        const url = `${process.env.BINANCE_BASE_URL}${endpoint}?${queryString}`;
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "X-MBX-APIKEY": apiKey,
                "Content-Type": "application/json",
            },
        });
        const responseJson = await response.json();
        if (response.status !== 200) {
            throw new Error(JSON.stringify(responseJson));
        }
        if (response.status === 200) {
            return responseJson;
        }
    }
    catch (err) {
        logger_service_1.default.saveError(err);
    }
};
exports.createMarketOrder = createMarketOrder;
