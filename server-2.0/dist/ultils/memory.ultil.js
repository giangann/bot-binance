"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSymbolTickerPricesNowMap = void 0;
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
