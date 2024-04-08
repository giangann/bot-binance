"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const binance_route_1 = __importDefault(require("./binance.route"));
const coin_route_1 = __importDefault(require("./coin.route"));
const indexRoute = express_1.default.Router();
indexRoute.use("/binance", binance_route_1.default);
indexRoute.use("/coin-price-1am", coin_route_1.default);
// default route
indexRoute.use("/", (req, res) => res.json("this is express app bot api"));
exports.default = indexRoute;
