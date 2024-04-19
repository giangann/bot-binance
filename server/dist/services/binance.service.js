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
const ccxt_1 = __importDefault(require("ccxt"));
// binance config
const baseUrl = "https://fapi.binance.com/fapi/";
const secret = "4wTgPjsyA9z1FIyUug81SOuTzCP5pZNyD3wHoIHpkjQ8yzoKUXgLaiV5izztl5qp";
const apiKey = "1A0eAdDSYP6mamVZRCmc0cSt4qm4K7pwaONb55yTlIdfuHMUYmyztBZnSbZ3hPBb";
const binance = new ccxt_1.default.binance({ apiKey, secret });
binance.setSandboxMode(true);
const fetchMyBalance = () => __awaiter(void 0, void 0, void 0, function* () {
    const balance = yield binance.fetchBalance();
    return balance;
});
// get balance now
const getMyBalance = () => __awaiter(void 0, void 0, void 0, function* () {
    const balance = yield binance.fetchBalance();
    let total = yield calTotalToUsdt(balance);
    return total;
});
// assume that just have bitcoin and usdt in balance
function calTotalToUsdt(balance) {
    return __awaiter(this, void 0, void 0, function* () {
        const symbol = "BTCUSDT";
        let tickerBTCUSDT = yield getTickerPrice(symbol);
        let totalBitcoin = balance.BTC.total * parseFloat(tickerBTCUSDT.price);
        let btc = balance.BTC.total;
        let usdt = balance.USDT.total;
        let totalByUSDT = {
            total: totalBitcoin + usdt,
            btc,
            usdt,
        };
        return totalByUSDT;
    });
}
const tickerPriceUrl = `${baseUrl}v2/ticker/price`;
const getTickerPrice = (symbol) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield axios_1.default.get(tickerPriceUrl, {
        params: { symbol },
    });
    const tickerPrice = response.data;
    return tickerPrice;
});
const getTickersPrice = () => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield axios_1.default.get(tickerPriceUrl);
    const tickersPrice = response.data;
    return tickersPrice;
});
const getSymbolPriceNow = (symbol) => __awaiter(void 0, void 0, void 0, function* () {
    const symbolPrice = yield getTickerPrice(symbol);
    if ("price" in symbolPrice) {
        return parseFloat(symbolPrice.price);
    }
});
const getSymbolClosePrice = (symbol) => __awaiter(void 0, void 0, void 0, function* () {
    let price = 0;
    let timestamp = "";
    const ohlcv = yield binance.fetchOHLCV(symbol, "1m", undefined, 1);
    if (ohlcv.length) {
        const lastOHLCV = ohlcv[0];
        if (lastOHLCV.length >= 5) {
            //[time, open, high, low, close, volum]
            timestamp = lastOHLCV[0].toString();
            price = lastOHLCV[4];
        }
    }
    return { timestamp, symbol, price };
});
const getAllSymbol = () => __awaiter(void 0, void 0, void 0, function* () {
    const tickersPrice = yield getTickersPrice();
    const symbols = tickersPrice.map((ticker) => {
        return ticker.symbol;
    });
    return symbols;
});
const getSymbolsClosePrice = (symbols) => __awaiter(void 0, void 0, void 0, function* () {
    return Promise.all(symbols.map((symbol) => {
        return getSymbolClosePrice(symbol);
    }));
});
const getOrderHistory = (symbol) => __awaiter(void 0, void 0, void 0, function* () {
    const orders = yield binance.fetchOrders(symbol);
    return orders;
});
const getTradeHistory = (symbol) => __awaiter(void 0, void 0, void 0, function* () {
    const tradeList = yield binance.fetchMyTrades(symbol);
    return tradeList;
});
const createMarketOrder = (symbol, side, amount, price) => __awaiter(void 0, void 0, void 0, function* () {
    const newMarketOrder = binance.createMarketOrder(symbol, side, amount, price);
    return newMarketOrder;
});
exports.default = {
    getMyBalance,
    getTickerPrice,
    getTickersPrice,
    getOrderHistory,
    getTradeHistory,
    createMarketOrder,
    getSymbolPriceNow,
    getSymbolClosePrice,
    getSymbolsClosePrice,
    getAllSymbol,
    fetchMyBalance,
};
