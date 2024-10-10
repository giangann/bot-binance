"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.combineTickerAndMarketToPrices = exports.numOfSellOrders = exports.numOfBuyOrders = exports.datasetItemsToSymbolPrices = exports.exchangeInfoSymbolsToMap = exports.positionsToMap = exports.symbolPricesToMap = exports.fakeDelay = void 0;
const fakeDelay = async (seconds) => {
    await new Promise((resolve, _reject) => {
        setTimeout(() => {
            resolve("");
        }, seconds * 1000);
    });
};
exports.fakeDelay = fakeDelay;
const symbolPricesToMap = (symbolPrices) => {
    const pricesMap = {};
    for (let symbolPrice of symbolPrices) {
        const symbol = symbolPrice.symbol;
        if (!(symbol in pricesMap)) {
            pricesMap[symbol] = symbolPrice;
        }
    }
    return pricesMap;
};
exports.symbolPricesToMap = symbolPricesToMap;
const positionsToMap = (positions) => {
    const positionsMap = {};
    for (let position of positions) {
        const symbol = position.symbol;
        if (!(symbol in positionsMap)) {
            positionsMap[symbol] = position;
        }
    }
    return positionsMap;
};
exports.positionsToMap = positionsToMap;
function exchangeInfoSymbolsToMap(exchangeInfoSymbols) {
    let res = {};
    for (let exchangeInfoSymbol of exchangeInfoSymbols) {
        let key = exchangeInfoSymbol.symbol;
        if (!(key in res)) {
            res[key] = exchangeInfoSymbol;
        }
    }
    return res;
}
exports.exchangeInfoSymbolsToMap = exchangeInfoSymbolsToMap;
const datasetItemsToSymbolPrices = (dtsetItems) => {
    const grouped = {};
    dtsetItems.forEach((item) => {
        const order = item.order;
        const symbolPrice = {
            symbol: item.symbol,
            tickerPrice: item.ticker_price || null,
            marketPrice: item.market_price || null,
        };
        if (!grouped[order]) {
            grouped[order] = [];
        }
        grouped[order].push(symbolPrice);
    });
    return Object.keys(grouped)
        .map((order) => parseInt(order, 10))
        .sort((a, b) => a - b)
        .map((order) => grouped[order]);
};
exports.datasetItemsToSymbolPrices = datasetItemsToSymbolPrices;
////////////////////////////
const numOfBuyOrders = (orders) => {
    if (orders.length === 0)
        return 0;
    let count = 0;
    for (let order of orders) {
        if (order.side === "BUY") {
            count = count + 1;
        }
    }
    return count;
};
exports.numOfBuyOrders = numOfBuyOrders;
////////////////////////////
const numOfSellOrders = (orders) => {
    if (orders.length === 0)
        return 0;
    let count = 0;
    for (let order of orders) {
        if (order.side === "SELL") {
            count = count + 1;
        }
    }
    return count;
};
exports.numOfSellOrders = numOfSellOrders;
function combineTickerAndMarketToPrices(symTickerPrices, marTikerPrices) {
    const result = [];
    const marketPriceMap = new Map();
    marTikerPrices.forEach(marketPrice => {
        marketPriceMap.set(marketPrice.symbol, marketPrice);
    });
    symTickerPrices.forEach(tickerPrice => {
        const marketPrice = marketPriceMap.get(tickerPrice.symbol);
        const combinedPrice = {
            symbol: tickerPrice.symbol,
            tickerPrice: tickerPrice.price,
            marketPrice: marketPrice ? marketPrice.markPrice : null
        };
        result.push(combinedPrice);
    });
    return result;
}
exports.combineTickerAndMarketToPrices = combineTickerAndMarketToPrices;
