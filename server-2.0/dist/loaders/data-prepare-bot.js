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
const helper_1 = require("../ultils/helper");
const prepareDataBot = async () => {
    // Fetch data
    // const promises = [getExchangeInfo(), getSymbolTickerPrices(), new CoinService().list(), getPositions()]
    // const [exchangeInfo,symbolTickerPricesNow,symbolPricesStart,positions ] = await Promise.all(promises)
    const exchangeInfo = await (0, binance_service_1.getExchangeInfo)();
    const symbolTickerPricesNow = await (0, binance_service_1.getSymbolTickerPrices)();
    const symbolPricesStart = await new coin_price_1am_service_1.default().list();
    const positions = await (0, binance_service_1.getPositions)();
    // Process data
    const symbolPricesStartMap = (0, helper_1.symbolPricesToMap)(symbolPricesStart);
    const { symbols } = exchangeInfo;
    const exchangeInfoSymbolsMap = (0, helper_1.exchangeInfoSymbolsToMap)(symbols);
    const positionsMap = (0, helper_1.positionsToMap)(positions);
    const ableOrderSymbols = Object.keys(symbolPricesStartMap);
    const ableOrderSymbolsMap = (0, helper_1.ableOrderSymbolsToMap)(ableOrderSymbols);
    global.symbolPricesStartMap = symbolPricesStartMap;
    global.symbolTickerPricesNowMap = (0, helper_1.symbolPriceTickersToMap)(symbolTickerPricesNow);
    global.exchangeInfoSymbolsMap = exchangeInfoSymbolsMap;
    global.positionsMap = positionsMap;
    global.ableOrderSymbolsMap = ableOrderSymbolsMap;
    // initial other global variable
    global.orderInfosMap = {};
    global.orderPieces = [];
    global.orderPiecesMap = {};
    global.isBotActive = true;
};
exports.default = prepareDataBot;
