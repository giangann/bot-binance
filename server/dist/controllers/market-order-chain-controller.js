"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const market_order_chain_service_1 = __importDefault(require("../services/market-order-chain.service"));
const server_response_ultil_1 = require("../ultils/server-response.ultil");
const log_service_1 = __importDefault(require("../services/log.service"));
const list = async (req, res) => {
    try {
        const listChain = await market_order_chain_service_1.default.list();
        server_response_ultil_1.ServerResponse.response(res, listChain);
    }
    catch (err) {
        console.log("err", err);
        server_response_ultil_1.ServerResponse.error(res, err.message);
    }
};
const isBotActive = async (req, res) => {
    try {
        const openChain = await market_order_chain_service_1.default.list({ status: "open" });
        server_response_ultil_1.ServerResponse.response(res, openChain.length);
    }
    catch (err) {
        console.log("err", err);
        server_response_ultil_1.ServerResponse.error(res, err.message);
    }
};
const getLogs = async (req, res) => {
    try {
        const chainId = parseInt(req.params?.chainId);
        const logs = await log_service_1.default.list({ market_order_chains_id: chainId });
        server_response_ultil_1.ServerResponse.response(res, logs);
    }
    catch (err) {
        console.log("err", err);
        server_response_ultil_1.ServerResponse.error(res, err.message);
    }
};
exports.default = { list, getLogs, isBotActive };
