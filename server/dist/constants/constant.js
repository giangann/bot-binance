"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IS_LIMIT_SYMBOL = exports.BOT_RUN_INTERVAL = exports.ERROR_CODE_RM_SYMBOL = exports.positionSample = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.positionSample = {
    symbol: "",
    positionAmt: "",
    entryPrice: "",
    breakEvenPrice: "",
    markPrice: "",
    unRealizedProfit: "",
    liquidationPrice: "",
    leverage: "",
    maxNotionalValue: "",
    marginType: "",
    isolatedMargin: "",
    isAutoAddMargin: "",
    positionSide: "",
    notional: "",
    isolatedWallet: "",
    updateTime: 0,
};
const ERROR_CODE_RM_SYMBOL_ENV = process.env.ERROR_CODE_RM_SYMBOL ?? "";
exports.ERROR_CODE_RM_SYMBOL = ERROR_CODE_RM_SYMBOL_ENV.split(",").map((code) => parseInt(code) || 0);
exports.BOT_RUN_INTERVAL = (parseFloat(process.env.BOT_RUN_INTERVAL) || 4) * 1000; // seconds
exports.IS_LIMIT_SYMBOL = Boolean(parseFloat(process.env.IS_LIMIT_SYMBOL || "0"));
