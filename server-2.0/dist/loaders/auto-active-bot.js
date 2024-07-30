"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.autoActiveStart = void 0;
const helper_1 = require("../ultils/helper");
const binance_service_1 = require("../services/binance.service");
const logger_service_1 = __importDefault(require("../services/logger.service"));
const autoActiveStart = () => {
    const autoActiveCheckInterval = setInterval(checkpoint, 5000);
};
exports.autoActiveStart = autoActiveStart;
const checkpoint = async () => {
    try {
        // get data, calculate price
        const klines = await (0, binance_service_1.getMarketPriceKlines)();
        const maxPrice = (0, helper_1.maxMarketPriceKlineFromArray)(klines);
        const currPrice = (0, helper_1.currentMarketPriceKlineFromArray)(klines);
        console.log(maxPrice, currPrice);
    }
    catch (error) {
        logger_service_1.default.saveErrorAndClg(error);
    }
};
