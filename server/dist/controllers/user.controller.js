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
const getAccInfoFetch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accInfoFetch = yield binance_service_1.default.getAccountFetch();
        server_response_ultil_1.ServerResponse.response(res, accInfoFetch);
    }
    catch (err) {
        server_response_ultil_1.ServerResponse.error(res, err.message);
    }
});
const getPosition = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // get position from binance service
    const positions = yield binance_service_1.default.getPositions();
    server_response_ultil_1.ServerResponse.response(res, positions);
    try {
    }
    catch (err) {
        server_response_ultil_1.ServerResponse.error(res, err.message);
    }
});
exports.default = {
    getOrderHistory,
    getTradeHistory,
    getAccInfo,
    getAccInfoFetch,
    getPosition,
};
