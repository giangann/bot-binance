"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const my_binance_controller_1 = __importDefault(require("../controllers/my-binance.controller"));
const myBinanceRoute = express_1.default.Router();
myBinanceRoute.post("/create-market-order", my_binance_controller_1.default.createMarketOrder);
myBinanceRoute.get("/position-info", my_binance_controller_1.default.getPosition);
myBinanceRoute.get("/account-info", my_binance_controller_1.default.getAccInfo);
myBinanceRoute.post("/close-all-long-positions", my_binance_controller_1.default.closeAllLongPositions);
exports.default = myBinanceRoute;
