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
const ccxt_1 = __importDefault(require("ccxt"));
const server_response_ultil_1 = require("../ultils/server-response.ultil");
// const fetch = require('node-fetch')
// import fetch from "node-fetch";
const binance = new ccxt_1.default.binance({
    headers: {
        apiKey: "1A0eAdDSYP6mamVZRCmc0cSt4qm4K7pwaONb55yTlIdfuHMUYmyztBZnSbZ3hPBb",
        secret: "4wTgPjsyA9z1FIyUug81SOuTzCP5pZNyD3wHoIHpkjQ8yzoKUXgLaiV5izztl5qp",
    },
});
const getOHLCV = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let allCurrencies = yield binance.fetchCurrencies(); //why undefined?
        // let fetchMarkets = await binance.fetchMarkets() // not ok
        let tickers = yield binance.fetchTickers();
        // let btcOHLCV = await binance.fetchOHLCV("BTC/USDT", "1m", undefined, 10);
        let gAllCurrencies = yield getAllCurrencies();
        let data = { allCurrencies, gAllCurrencies };
        console.log("data", data);
        return server_response_ultil_1.ServerResponse.response(res, data);
    }
    catch (e) {
        return server_response_ultil_1.ServerResponse.error(res, e.name || "Server err");
    }
});
function getAllCurrencies() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = yield binance.publicGetTicker24hr();
            // @ts-ignore
            const currencyData = data.map((item) => ({
                symbol: item.symbol,
                price: parseFloat(item.lastPrice),
                volume: parseFloat(item.quoteVolume),
                percentChange: parseFloat(item.priceChangePercent),
                marketCap: parseFloat(item.quoteVolume) * parseFloat(item.lastPrice),
            }));
            return data;
        }
        catch (error) {
            console.error("Failed to fetch data:", error.message);
            return null;
        }
    });
}
exports.default = { getOHLCV };
