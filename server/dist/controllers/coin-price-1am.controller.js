"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_response_ultil_1 = require("../ultils/server-response.ultil");
const coin_service_1 = __importDefault(require("../services/coin.service"));
const list = async (req, res) => {
    const testnet = req.query?.testnet;
    let isTestnet;
    if (testnet === "false")
        isTestnet = false;
    else
        isTestnet = true;
    const coinService = new coin_service_1.default(isTestnet);
    try {
        const listCoinPrices = await coinService.list();
        return server_response_ultil_1.ServerResponse.response(res, listCoinPrices);
    }
    catch (err) {
        console.log(err);
        return server_response_ultil_1.ServerResponse.error(res, err.name || "Server err");
    }
};
exports.default = { list };
