"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_connect_1 = require("../loaders/db-connect");
const market_order_chain_service_1 = __importDefault(require("../services/market-order-chain.service"));
const test = async () => {
    await (0, db_connect_1.connectDatabase)();
    const chainData = await market_order_chain_service_1.default.detail(150);
    console.log(chainData);
};
// test()
