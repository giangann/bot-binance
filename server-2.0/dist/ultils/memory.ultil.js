"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSymbolMarketPricesNowMap = exports.updateSymbolTickerPricesNowMap = void 0;
const updateSymbolTickerPricesNowMap = (symbolTickerPricesWs) => {
    for (let symbolTickerPrice of symbolTickerPricesWs) {
        const symbol = symbolTickerPrice.s;
        const symbolTickerPriceNow = global.symbolTickerPricesNowMap[symbol];
        if (symbolTickerPriceNow) {
            symbolTickerPriceNow.price = symbolTickerPrice.c;
        }
    }
};
exports.updateSymbolTickerPricesNowMap = updateSymbolTickerPricesNowMap;
const updateSymbolMarketPricesNowMap = (symbolMarketPricesWs) => {
    for (let symbolMarketPrice of symbolMarketPricesWs) {
        const symbol = symbolMarketPrice.s;
        const symbolMarketPriceNow = global.symbolMarketPricesNowMap[symbol];
        if (symbolMarketPriceNow) {
            symbolMarketPriceNow.markPrice = symbolMarketPrice.p;
            symbolMarketPriceNow.indexPrice = symbolMarketPrice.i;
        }
    }
};
exports.updateSymbolMarketPricesNowMap = updateSymbolMarketPricesNowMap;
