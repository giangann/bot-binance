"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const binance_service_1 = __importDefault(require("../services/binance.service"));
const server_response_ultil_1 = require("../ultils/server-response.ultil");
const getOrderHistory = async (req, res) => {
    try {
        // get list order id from order service in database
        // const orders = await binanceService.getOrderHistory("BTCUSDT");
        // ServerResponse.response(res, orders);
    }
    catch (err) {
        server_response_ultil_1.ServerResponse.error(res, err.message);
    }
};
const getTradeHistory = async (req, res) => {
    try {
        // const tradeList = await binanceService.getTradeHistory("BTCUSDT");
        // ServerResponse.response(res, tradeList);
    }
    catch (err) {
        server_response_ultil_1.ServerResponse.error(res, err.message);
    }
};
const getAccInfo = async (req, res) => {
    try {
        const accInfo = await binance_service_1.default.getAccountInfo();
        server_response_ultil_1.ServerResponse.response(res, accInfo);
    }
    catch (err) {
        server_response_ultil_1.ServerResponse.error(res, err.message);
    }
};
const getAccInfoFetch = async (req, res) => {
    try {
        const accInfoFetch = await binance_service_1.default.getAccountFetch();
        server_response_ultil_1.ServerResponse.response(res, accInfoFetch);
    }
    catch (err) {
        server_response_ultil_1.ServerResponse.error(res, err.message);
    }
};
const getPosition = async (req, res) => {
    // get position from binance service
    const positions = await binance_service_1.default.getPositions();
    server_response_ultil_1.ServerResponse.response(res, positions);
    try {
    }
    catch (err) {
        server_response_ultil_1.ServerResponse.error(res, err.message);
    }
};
exports.default = {
    getOrderHistory,
    getTradeHistory,
    getAccInfo,
    getAccInfoFetch,
    getPosition,
};
