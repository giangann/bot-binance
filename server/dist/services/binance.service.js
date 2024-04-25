"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
const helper_ultil_1 = require("../ultils/helper.ultil");
const coin_service_1 = __importDefault(require("./coin.service"));
dotenv_1.default.config();
// GET ENV
const baseUrl = process.env.BINANCE_BASE_URL;
const secret = process.env.BINANCE_SECRET;
const apiKey = process.env.BINANCE_API_KEY;
// CONSTANT
const commonParams = {
    recvWindow: 5000,
    // timestamp: Date.now(),
};
const commonHeader = {
    "X-MBX-APIKEY": apiKey,
};
const commonAxiosOpt = {
    headers: Object.assign({}, commonHeader),
};
const getPositions = () => __awaiter(void 0, void 0, void 0, function* () {
    const paramsNow = { recvWindow: 5000, timestamp: Date.now() };
    const queryString = (0, helper_ultil_1.paramsToQueryWithSignature)(secret, paramsNow);
    const endpoint = "/fapi/v2/positionRisk";
    const url = `${baseUrl}${endpoint}?${queryString}`;
    const response = yield axios_1.default.get(url, commonAxiosOpt);
    const positions = response.data;
    return positions;
});
const getAccountInfo = () => __awaiter(void 0, void 0, void 0, function* () {
    const endpoint = "/fapi/v2/account";
    const paramsNow = { recvWindow: 5000, timestamp: Date.now() };
    const queryString = (0, helper_ultil_1.paramsToQueryWithSignature)(secret, paramsNow);
    const url = `${baseUrl}${endpoint}?${queryString}`;
    const response = yield axios_1.default.get(url, commonAxiosOpt);
    const accInfo = response.data;
    return accInfo;
});
const test = () => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield getAccountInfo();
    console.log("getAccountInfo", data);
    console.log("some info", data.availableBalance, data.totalWalletBalance);
});
// test();
const getSymbolPriceTickers1Am = () => __awaiter(void 0, void 0, void 0, function* () {
    const price1Am = yield coin_service_1.default.list();
    return price1Am;
});
const getSymbolPriceTicker = (symbol) => __awaiter(void 0, void 0, void 0, function* () {
    const endpoint = "/fapi/v2/ticker/price";
    const url = `${baseUrl}${endpoint}`;
    const response = yield axios_1.default.get(url, {
        params: { symbol },
    });
    const tickerPrice = response.data;
    return tickerPrice;
});
const getSymbolPriceTickers = () => __awaiter(void 0, void 0, void 0, function* () {
    const endpoint = "/fapi/v2/ticker/price";
    const url = `${baseUrl}${endpoint}`;
    const response = yield axios_1.default.get(url);
    const tickersPrice = response.data;
    return tickersPrice;
});
const getOrdersFromToday1Am = () => __awaiter(void 0, void 0, void 0, function* () {
    const endpoint = "/fapi/v1/allOrders";
    const paramsNow = Object.assign(Object.assign({}, commonParams), { timestamp: Date.now() });
    const params = Object.assign(Object.assign({}, paramsNow), { startTime: (0, helper_ultil_1.getTimestampOfToday1AM)() });
    const queryString = (0, helper_ultil_1.paramsToQueryWithSignature)(secret, params);
    const url = `${baseUrl}${endpoint}?${queryString}`;
    const response = yield axios_1.default.get(url, commonAxiosOpt);
    const orders = response.data;
    return orders;
});
const createMarketOrder = (symbol, side, quantity, type = "market", _price) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const endpoint = "/fapi/v1/order";
        const paramsNow = { recvWindow: 5000, timestamp: Date.now() };
        let orderParams = Object.assign({ symbol,
            type,
            quantity,
            side }, paramsNow);
        const queryString = (0, helper_ultil_1.paramsToQueryWithSignature)(secret, orderParams);
        const response = yield fetch(`${baseUrl}${endpoint}?${queryString}`, {
            method: "POST",
            headers: {
                "X-MBX-APIKEY": apiKey,
                "Content-Type": "application/json",
            },
        });
        if (response.status === 200 || response.status === 201) {
            const data = yield response.json();
            return {
                success: true,
                data: data,
            };
        }
        else {
            const err = yield response.json();
            return {
                success: false,
                error: err,
                payload: orderParams,
            };
        }
    }
    catch (err) {
        console.log("err msg", err);
    }
});
exports.default = {
    getSymbolPriceTicker,
    getSymbolPriceTickers,
    createMarketOrder,
    getSymbolPriceTickers1Am,
    getPositions,
    getAccountInfo,
    getOrdersFromToday1Am,
};
