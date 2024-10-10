"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyBinanceService = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const helper_1 = require("../helper");
const logger_1 = require("../logger");
const helper_2 = require("../ultils/helper");
dotenv_1.default.config();
class MyBinanceService {
    baseRestApiUrl;
    apiKey;
    apiSecret;
    recvWindow;
    logger;
    constructor() {
        this.baseRestApiUrl = process.env.BINANCE_BASE_URL;
        this.apiKey = process.env.BINANCE_API_KEY ?? "";
        this.apiSecret = process.env.BINANCE_API_SECRET ?? "";
        this.recvWindow = parseInt(process.env.RECV_WINDOW) || 10000;
        this.logger = new logger_1.Logger();
    }
    /**
     * getSymbolTickerPrices
     */
    async getSymbolTickerPrices() {
        try {
            const endpoint = "/fapi/v2/ticker/price";
            const baseUrl = this.baseRestApiUrl;
            const url = `${baseUrl}${endpoint}`;
            const response = await fetch(url);
            const responseJson = await response.json();
            if (response.status !== 200) {
                throw new Error(JSON.stringify(responseJson));
            }
            if (response.status === 200) {
                return responseJson;
            }
        }
        catch (error) {
            this.logger.saveError(error);
            throw error;
        }
    }
    /**
     * getSymbolMarketPrices
     */
    async getSymbolMarketPrices() {
        try {
            const endpoint = "/fapi/v1/premiumIndex";
            const baseUrl = this.baseRestApiUrl;
            const url = `${baseUrl}${endpoint}`;
            const response = await fetch(url);
            const responseJson = await response.json();
            if (response.status !== 200) {
                throw new Error(JSON.stringify(responseJson));
            }
            if (response.status === 200) {
                return responseJson;
            }
        }
        catch (error) {
            this.logger.saveError(error);
            throw error;
        }
    }
    /**
     * placeOrderRest
     */
    async createMarketOrder(symbol, side, quantity, arbitraryId) {
        try {
            const type = "market";
            const endpoint = "/fapi/v1/order";
            const baseUrl = this.baseRestApiUrl;
            const apiSecret = this.apiSecret;
            const apiKey = this.apiKey;
            const paramsNow = { recvWindow: this.recvWindow, timestamp: Date.now() };
            let orderParams = {
                symbol,
                type,
                quantity,
                side,
                newClientOrderId: arbitraryId,
                ...paramsNow,
            };
            const queryString = (0, helper_2.paramsToQueryWithSignature)(apiSecret, orderParams);
            const url = `${baseUrl}${endpoint}?${queryString}`;
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "X-MBX-APIKEY": apiKey,
                    "Content-Type": "application/json",
                },
            });
            const responseJson = await response.json();
            if (response.status !== 200) {
                return { ...responseJson, clientOrderId: arbitraryId };
            }
            if (response.status === 200) {
                return responseJson;
            }
        }
        catch (error) {
            this.logger.saveError(error);
            throw error;
        }
    }
    getPositions = async () => {
        try {
            const endpoint = "/fapi/v2/positionRisk";
            const baseUrl = this.baseRestApiUrl;
            const apiSecret = this.apiSecret;
            const apiKey = this.apiKey;
            const paramsNow = { recvWindow: this.recvWindow, timestamp: Date.now() };
            const queryString = (0, helper_2.paramsToQueryWithSignature)(apiSecret, paramsNow);
            const url = `${baseUrl}${endpoint}?${queryString}`;
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
        }
        catch (error) {
            this.logger.saveError(error);
            throw error;
        }
    };
    closeAllPositions = async () => {
        const positions = await this.getPositions();
        const positionsNotZero = positions.filter((position) => parseFloat(position.positionAmt) !== 0);
        const shortPositions = positionsNotZero.filter((position) => parseFloat(position.positionAmt) < 0);
        const longPositions = positionsNotZero.filter((position) => parseFloat(position.positionAmt) > 0);
        const sellPromises = longPositions.map((position) => this.createMarketOrder(position.symbol, "SELL", parseFloat(position.positionAmt)));
        const buyPromises = shortPositions.map((position) => this.createMarketOrder(position.symbol, "BUY", -parseFloat(position.positionAmt)));
        const promises = [...sellPromises, ...buyPromises];
        const responses = await Promise.all(promises);
        const result = { success: 0, failure: 0 };
        for (const response of responses) {
            if ((0, helper_2.isBinanceError)(response)) {
                result.failure += 1;
            }
            else {
                result.success += 1;
            }
        }
        return result;
    };
    getExchangeInfo = async () => {
        try {
            const endpoint = "/fapi/v1/exchangeInfo";
            const baseUrl = this.baseRestApiUrl;
            const apiKey = this.apiKey;
            const url = `${baseUrl}${endpoint}`;
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
        }
        catch (error) {
            this.logger.saveError(error);
            throw error;
        }
    };
    getAccountInfo = async () => {
        try {
            const endpoint = "/fapi/v2/account";
            const baseUrl = this.baseRestApiUrl;
            const apiSecret = this.apiSecret;
            const apiKey = this.apiKey;
            const paramsNow = { recvWindow: this.recvWindow, timestamp: Date.now() };
            const queryString = (0, helper_2.paramsToQueryWithSignature)(apiSecret, paramsNow);
            const url = `${baseUrl}${endpoint}?${queryString}`;
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
        }
        catch (error) {
            this.logger.saveError(error);
            throw error;
        }
    };
    /**
     * getSymbolPrices
     */
    async getSymbolPrices() {
        const symbolTickerPrices = await this.getSymbolTickerPrices();
        const symbolMarketPrices = await this.getSymbolMarketPrices();
        const symbolPrices = (0, helper_1.combineTickerAndMarketToPrices)(symbolTickerPrices, symbolMarketPrices);
        return symbolPrices;
    }
    /**
     * name
     */
    async getMarketPriceKlines() {
        try {
            const endpoint = "/fapi/v1/markPriceKlines";
            const queryString = `symbol=BTCUSDT&interval=1m&limit=60`;
            const baseUrl = this.baseRestApiUrl;
            const url = `${baseUrl}${endpoint}?${queryString}`;
            const response = await fetch(url);
            const responseJson = await response.json();
            if ((0, helper_2.isBinanceError)(responseJson)) {
                throw new Error(JSON.stringify(responseJson));
            }
            if (response.status === 200) {
                return responseJson;
            }
        }
        catch (error) {
            this.logger.saveError(error);
            throw error;
        }
    }
}
exports.MyBinanceService = MyBinanceService;
