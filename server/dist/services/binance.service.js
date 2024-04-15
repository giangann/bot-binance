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
// binance config
const secret = "4wTgPjsyA9z1FIyUug81SOuTzCP5pZNyD3wHoIHpkjQ8yzoKUXgLaiV5izztl5qp";
const apiKey = "1A0eAdDSYP6mamVZRCmc0cSt4qm4K7pwaONb55yTlIdfuHMUYmyztBZnSbZ3hPBb";
const binance = new ccxt_1.default.binance({ apiKey, secret });
binance.setSandboxMode(true);
// constant
const TRADE_SIZE_BY_USDT = 100;
const DOUBLE_PERCENT = 5 / 100;
const STOP_PERCENT = 2.5 / 100;
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
const getTickerPrice = (symbol) => __awaiter(void 0, void 0, void 0, function* () {
    const tickerPrice = yield binance.fapiPublicV2GetTickerPrice({
        symbol,
    });
    return tickerPrice;
});
const getSymbolPriceNow = (symbol) => __awaiter(void 0, void 0, void 0, function* () {
    const symbolPrice = yield binance.fapiPublicV2GetTickerPrice({
        symbol,
    });
    if ("price" in symbolPrice) {
        return parseFloat(symbolPrice.price);
    }
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
    getOrderHistory,
    getTradeHistory,
    createMarketOrder,
    getSymbolPriceNow,
};
