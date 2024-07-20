"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tickerPricesUpdateEvHandlerWs = void 0;
const logger_service_1 = __importDefault(require("../../services/logger.service"));
const memory_ultil_1 = require("../memory.ultil");
////////////////////////////////////////////////////
// handle when ticker price update
const tickerPricesUpdateEvHandlerWs = (msg) => {
    try {
        if (global.isBotActive) {
            // evaluate and place order if bot is active
            const msgString = msg.toString();
            const symbolTickerPrices = JSON.parse(msgString);
            // update memory
            (0, memory_ultil_1.updateSymbolTickerPricesNowMap)(symbolTickerPrices);
        }
    }
    catch (err) {
        logger_service_1.default.saveError(err);
    }
};
exports.tickerPricesUpdateEvHandlerWs = tickerPricesUpdateEvHandlerWs;
