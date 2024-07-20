"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.totalPnlFromPositionsMap = exports.ableOrderSymbolsMapToArray = exports.errorWsApiResponseToString = exports.rateLimitsArrayToString = exports.filterPositionsNotZero = exports.mergeTicerPriceAndMarketPriceBySymbol = exports.orderPiecesToMap = exports.ableOrderSymbolsToMap = exports.symbolPriceMarketsToMap = exports.symbolPriceTickersToMap = exports.positionsToMap = exports.exchangeInfoSymbolsToMap = exports.symbolPricesToMap = exports.validateAmount = exports.binanceStreamToSymbolPrice = exports.paramsToQueryWithSignature = exports.generateSignature = exports.fakeDelay = void 0;
const crypto_1 = require("crypto");
const fakeDelay = async (seconds) => {
    await new Promise((resolve, _reject) => {
        setTimeout(() => {
            resolve("");
        }, seconds * 1000);
    });
};
exports.fakeDelay = fakeDelay;
// Function to generate the signature
function generateSignature(params, secret) {
    const sortedParams = Object.keys(params)
        .sort()
        .map((key) => `${key}=${params[key]}`)
        .join("&");
    return (0, crypto_1.createHmac)("sha256", secret).update(sortedParams).digest("hex");
}
exports.generateSignature = generateSignature;
function paramsToQueryWithSignature(binance_api_secret, paramsObject) {
    let queryString = Object.keys(paramsObject)
        .map((key) => {
        return `${encodeURIComponent(key)}=${paramsObject[key]}`;
    })
        .join("&");
    const signature = (0, crypto_1.createHmac)("sha256", binance_api_secret)
        .update(queryString)
        .digest("hex");
    queryString += `&signature=${signature}`;
    return queryString;
}
exports.paramsToQueryWithSignature = paramsToQueryWithSignature;
// take TMarketStream or TTickerStream
// return TSymbolMarkPrice or TSYmbolTickerPrice
function binanceStreamToSymbolPrice(streamResponse) {
    let event = streamResponse.stream;
    // if tickerPrice then return (symbol, price)[]
    if (event === "!ticker@arr") {
        let stremDataArrayOfObj = streamResponse.data; // Narrow down the type
        let data = stremDataArrayOfObj.map((obj) => {
            return {
                symbol: obj.s,
                price: obj.c,
            };
        });
        return { event, data };
    }
    // if markPrice then return (symbol, markPrice)[]
    if (event === "!markPrice@arr") {
        let stremDataArrayOfObj = streamResponse.data; // Narrow down the type
        let data = stremDataArrayOfObj.map((obj) => {
            return {
                symbol: obj.s,
                markPrice: obj.p,
            };
        });
        return { event, data };
    }
}
exports.binanceStreamToSymbolPrice = binanceStreamToSymbolPrice;
function validateAmount(amount, precision) {
    switch (precision) {
        case 0:
            return Math.round(amount);
            break;
        case 1:
            return Math.round(amount * 1e1) / 1e1;
            break;
        case 2:
            return Math.round(amount * 1e2) / 1e2;
            break;
        case 3:
            return Math.round(amount * 1e3) / 1e3;
            break;
        default:
            return Math.round(amount * 1e1) / 1e1;
            break;
    }
    // if (amount >= 1) return Math.round(amount);
    // if (amount < 1) return Math.round(amount * 1e2) / 1e2;
}
exports.validateAmount = validateAmount;
// arrray to map
function symbolPricesToMap(symbolPrices) {
    let res = {};
    for (let symbolPrice of symbolPrices) {
        const symbol = symbolPrice.symbol;
        if (!(symbol in res)) {
            res[symbol] = symbolPrice;
        }
    }
    return res;
}
exports.symbolPricesToMap = symbolPricesToMap;
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
function positionsToMap(positions) {
    let res = {};
    for (let position of positions) {
        let key = position.symbol;
        if (!(key in res)) {
            res[key] = position;
        }
    }
    return res;
}
exports.positionsToMap = positionsToMap;
function symbolPriceTickersToMap(symbolPriceTickers) {
    let res = {};
    for (let symbolPrice of symbolPriceTickers) {
        let key = symbolPrice.symbol;
        if (!(key in res)) {
            res[key] = symbolPrice;
        }
    }
    return res;
}
exports.symbolPriceTickersToMap = symbolPriceTickersToMap;
function symbolPriceMarketsToMap(symbolPriceMarket) {
    let res = {};
    for (let symbolPrice of symbolPriceMarket) {
        let key = symbolPrice.symbol;
        if (!(key in res)) {
            res[key] = symbolPrice;
        }
    }
    return res;
}
exports.symbolPriceMarketsToMap = symbolPriceMarketsToMap;
function ableOrderSymbolsToMap(symbols) {
    let res = {};
    for (let symbol of symbols) {
        if (!(symbol in res)) {
            res[symbol] = true;
        }
    }
    return res;
}
exports.ableOrderSymbolsToMap = ableOrderSymbolsToMap;
function orderPiecesToMap(orderPieces) {
    let res = {};
    for (const piece of orderPieces) {
        const orderId = piece.id;
        if (!(orderId in res)) {
            res[orderId] = piece;
        }
    }
    return res;
}
exports.orderPiecesToMap = orderPiecesToMap;
function mergeTicerPriceAndMarketPriceBySymbol(tickerPrices, marketPrices) {
    // Change array to map
    const tickerPricesMap = symbolPriceTickersToMap(tickerPrices);
    const marketPricesMap = symbolPriceMarketsToMap(marketPrices);
    const result = [];
    // merge handle here
    // 1.
    // Loop through tickerPrices
    // Find the correspond marketPrice
    // Push to result the value of tickerPrice and marketPrice, remove that marketPrice from the marketPricesMap object
    // Loop through remain value of marketPricesMap object
    // Push to result the value of marketPrice and tickerPrice (null)
    // Loop through tickerPrices
    for (const tickerPrice of tickerPrices) {
        const key = tickerPrice.symbol;
        const marketPrice = marketPricesMap[key];
        if (marketPrice) {
            result.push({
                ...marketPrice,
                price: tickerPrice.price,
            });
            delete marketPricesMap[key]; // Remove matched marketPrice
        }
        else {
            result.push({
                symbol: tickerPrice.symbol,
                markPrice: null,
                indexPrice: "",
                estimatedSettlePrice: "",
                lastFundingRate: "",
                interestRate: "",
                nextFundingTime: 0,
                time: tickerPrice.time,
                price: tickerPrice.price,
            });
        }
    }
    // Loop through remaining values of marketPricesMap
    for (const key in marketPricesMap) {
        const marketPrice = marketPricesMap[key];
        result.push({
            ...marketPrice,
            price: null,
            time: marketPrice.time,
        });
    }
    return result;
}
exports.mergeTicerPriceAndMarketPriceBySymbol = mergeTicerPriceAndMarketPriceBySymbol;
const filterPositionsNotZero = (positions) => {
    return positions.filter((position) => parseFloat(position.positionAmt) !== 0);
};
exports.filterPositionsNotZero = filterPositionsNotZero;
const rateLimitsArrayToString = (rateLimits) => {
    let result = "";
    for (let rateLimit of rateLimits) {
        const { rateLimitType, interval, intervalNum, limit, count } = rateLimit;
        const partialString = `Type: ${rateLimitType}: ${count}/${limit} each ${intervalNum} ${interval}`;
        result += `${partialString} - `;
    }
    return result;
};
exports.rateLimitsArrayToString = rateLimitsArrayToString;
const errorWsApiResponseToString = (error) => {
    const { code, msg } = error;
    return `${code}: ${msg}`;
};
exports.errorWsApiResponseToString = errorWsApiResponseToString;
const ableOrderSymbolsMapToArray = (ableOrderSymbolsMap) => {
    const symbols = Object.entries(ableOrderSymbolsMap)
        .filter(([_symbol, isAble]) => isAble)
        .map(([symbol, _isAble]) => symbol);
    return symbols;
};
exports.ableOrderSymbolsMapToArray = ableOrderSymbolsMapToArray;
const totalPnlFromPositionsMap = (positionsMap) => {
    let result = 0;
    const positionsMapEntries = Object.entries(positionsMap);
    for (const [_symbol, position] of positionsMapEntries) {
        const pnl = position?.unRealizedProfit;
        if (pnl) {
            const pnlNumber = parseFloat(pnl);
            result += pnlNumber;
        }
    }
    return result;
};
exports.totalPnlFromPositionsMap = totalPnlFromPositionsMap;
