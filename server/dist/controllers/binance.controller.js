"use strict";
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
const getOHLCV = async (req, res) => {
    try {
        let allCurrencies = await binance.fetchCurrencies(); //why undefined?
        let tickers = await binance.fetchTickers();
        let gAllCurrencies = await getAllCurrencies();
        let data = { allCurrencies, gAllCurrencies };
        console.log("data", data);
        return server_response_ultil_1.ServerResponse.response(res, data);
    }
    catch (e) {
        return server_response_ultil_1.ServerResponse.error(res, e.name || "Server err");
    }
};
async function getAllCurrencies() {
    try {
        const data = await binance.publicGetTicker24hr();
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
}
exports.default = { getOHLCV };
