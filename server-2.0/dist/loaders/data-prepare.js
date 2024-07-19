"use strict";
// call multiple rest api to fetch data
// from database, binance system
// process and form the fetched data
// save to ram by underlying the global variable
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const binance_service_1 = require("../services/binance.service");
const coin_price_1am_service_1 = __importDefault(require("../services/coin-price-1am.service"));
const prepareData = async () => {
    const symbolPricesStart = await new coin_price_1am_service_1.default().list();
    const symbolTickerPricesNow = await (0, binance_service_1.getSymbolTickerPrices)();
    const symbolMarketPricesNow = await (0, binance_service_1.getSymbolMarketPrices)();
    global.symbolPricesStart = symbolPricesStart;
    global.symbolMarketPricesNow = symbolMarketPricesNow;
    global.symbolTickerPricesNow = symbolTickerPricesNow;
};
exports.default = prepareData;
