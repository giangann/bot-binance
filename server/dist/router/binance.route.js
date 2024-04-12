"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const binance_controller_1 = __importDefault(require("../controllers/binance.controller"));
const express_1 = __importDefault(require("express"));
const binanceRoute = express_1.default.Router();
binanceRoute.get('/ohlcv', binance_controller_1.default.getOHLCV);
exports.default = binanceRoute;
