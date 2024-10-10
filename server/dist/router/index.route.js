"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auto_active_config_route_1 = __importDefault(require("./auto-active-config.route"));
const bot_route_1 = __importDefault(require("./bot.route"));
const coin_price_1am_route_1 = __importDefault(require("./coin-price-1am-route"));
const coin_route_1 = __importDefault(require("./coin.route"));
const dataset_item_route_1 = __importDefault(require("./dataset-item.route"));
const dataset_route_1 = __importDefault(require("./dataset.route"));
const my_binance_route_1 = __importDefault(require("./my-binance.route"));
const order_chain_test_route_1 = __importDefault(require("./order-chain-test.route"));
const order_chain_route_1 = __importDefault(require("./order-chain.route"));
const indexRoute = express_1.default.Router();
indexRoute.use("/coin-price-1am", coin_price_1am_route_1.default);
indexRoute.use("/order-chain", order_chain_route_1.default);
indexRoute.use("/order-chain-test", order_chain_test_route_1.default);
indexRoute.use("/bot", bot_route_1.default);
indexRoute.use("/coin", coin_route_1.default);
indexRoute.use("/config", auto_active_config_route_1.default);
indexRoute.use("/dataset", dataset_route_1.default);
indexRoute.use("/dataset-item", dataset_item_route_1.default);
indexRoute.use("/my-binance", my_binance_route_1.default);
// default route
indexRoute.use("/", (req, res) => res.json("This is default route: Hello to BOT BINANCE 2.0"));
exports.default = indexRoute;
