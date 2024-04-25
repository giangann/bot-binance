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
const binance_service_1 = __importDefault(require("../services/binance.service"));
const server_response_ultil_1 = require("../ultils/server-response.ultil");
// constant
const TRADE_SIZE_BY_USDT = 100;
const DOUBLE_PERCENT = 5 / 100;
const STOP_PERCENT = 2.5 / 100;
const getBalance = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const balance = await binanceService.fetchMyBalance();
        // update balance realtime each 5s
        // setInterval(async () => {
        //   const balance = await binanceService.getMyBalance();
        //   const { total, btc, usdt } = balance;
        //   global.wsServerGlob.emit("ws-balance", total, btc, usdt);
        // }, 5000);
        // ServerResponse.response(res, balance);
    }
    catch (err) {
        console.log(err.message);
    }
});
const getOrderHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // get list order id from order service in database
        // const orders = await binanceService.getOrderHistory("BTCUSDT");
        // ServerResponse.response(res, orders);
    }
    catch (err) {
        server_response_ultil_1.ServerResponse.error(res, err.message);
    }
});
const getTradeHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const tradeList = await binanceService.getTradeHistory("BTCUSDT");
        // ServerResponse.response(res, tradeList);
    }
    catch (err) {
        server_response_ultil_1.ServerResponse.error(res, err.message);
    }
});
const getAccInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accInfo = yield binance_service_1.default.getAccountInfo();
        server_response_ultil_1.ServerResponse.response(res, accInfo);
    }
    catch (err) {
        server_response_ultil_1.ServerResponse.error(res, err.message);
    }
});
exports.default = { getBalance, getOrderHistory, getTradeHistory, getAccInfo };
