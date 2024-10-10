"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const market_order_chain_test_controller_1 = __importDefault(require("../controllers/market-order-chain-test-controller"));
const orderChainTestRoute = (0, express_1.Router)();
orderChainTestRoute.get("/", market_order_chain_test_controller_1.default.list);
orderChainTestRoute.get("/pieces-by-id", market_order_chain_test_controller_1.default.getPiecesById);
orderChainTestRoute.delete("/:id", market_order_chain_test_controller_1.default.remove);
orderChainTestRoute.post("/mark-all-open-chain-as-closed", market_order_chain_test_controller_1.default.markAllOpenChainsAsClosed);
exports.default = orderChainTestRoute;
