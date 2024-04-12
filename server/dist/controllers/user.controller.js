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
// import crypto
// binance config
const secret = "4wTgPjsyA9z1FIyUug81SOuTzCP5pZNyD3wHoIHpkjQ8yzoKUXgLaiV5izztl5qp";
const apiKey = "1A0eAdDSYP6mamVZRCmc0cSt4qm4K7pwaONb55yTlIdfuHMUYmyztBZnSbZ3hPBb";
const binance = new ccxt_1.default.binance({ apiKey, secret });
binance.setSandboxMode(true);
// constant
const TRADE_SIZE_BY_USDT = 0.01;
const getBalance = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const balance = yield binance.fetchBalance();
        let total = yield calculateTotalToUSDTFake(balance);
        console.log("balance total", total);
        server_response_ultil_1.ServerResponse.response(res, total);
    }
    catch (err) {
        console.log(err);
    }
});
function calculateTotalToUSDTFake(balance) {
    return __awaiter(this, void 0, void 0, function* () {
        // assume that just have bitcoin and usdt
        let params = {
            symbol: "BTCUSDT",
        };
        let tickerBTCUSDT = yield binance.fapiPublicV2GetTickerPrice(params);
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
const getOrderHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // get list order id from order service in database
        let listOrderId = yield orderIdsFromTradeList();
        // promise.all list order to get list promise of api banance all fetchOrder(orderId)
        let orders = yield Promise.all(listOrderId.map((order_id) => __awaiter(void 0, void 0, void 0, function* () {
            return yield binance.fetchOrder(order_id, "BTCUSDT");
        })));
        server_response_ultil_1.ServerResponse.response(res, orders);
    }
    catch (err) {
        server_response_ultil_1.ServerResponse.error(res, err.message);
    }
});
const getTradeHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tradeList = yield binance.fetchMyTrades("BTCUSDT");
        // const tradeList = response.map((trade) => {
        //   return {
        //     order_id: trade.order,
        //     amount: trade.amount,
        //     price: trade.price,
        //     datetime: trade.datetime,
        //   };
        // });
        server_response_ultil_1.ServerResponse.response(res, tradeList);
    }
    catch (err) {
        server_response_ultil_1.ServerResponse.error(res, err.message);
    }
});
function getMyTrades() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let tradeList = yield binance.fetchMyTrades("BTCUSDT");
            return tradeList;
        }
        catch (err) {
            console.log("err", err);
        }
    });
}
function orderIdsFromTradeList() {
    return __awaiter(this, void 0, void 0, function* () {
        let orderIds = [];
        const tradeList = yield getMyTrades();
        for (let trade of tradeList) {
            if (!orderIds.includes(trade.order))
                orderIds.push(trade.order);
        }
        return orderIds;
    });
}
exports.default = { getBalance, getOrderHistory, getTradeHistory };
