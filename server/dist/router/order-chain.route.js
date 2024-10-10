"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const market_order_chain_controller_1 = __importDefault(require("../controllers/market-order-chain-controller"));
const orderChainRoute = (0, express_1.Router)();
orderChainRoute.get("/", market_order_chain_controller_1.default.list);
orderChainRoute.get("/pieces-by-id", market_order_chain_controller_1.default.getPiecesById);
orderChainRoute.put("/:id", market_order_chain_controller_1.default.update);
orderChainRoute.delete("/:id", market_order_chain_controller_1.default.remove);
orderChainRoute.post("/mark-all-open-chain-as-closed", market_order_chain_controller_1.default.markAllOpenChainsAsClosed);
exports.default = orderChainRoute;
