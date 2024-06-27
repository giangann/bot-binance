"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.totalUnrealizedPnl = exports.mergeTicerPriceAndMarketPriceBySymbol = exports.stackTraceShorter = exports.filterFailOrder = exports.filterSuccessOrder = exports.filterAblePosition = exports.isSuccess = exports.validateAmount = exports.orderPiecesToMap = exports.positionsToMap = exports.symbolPriceMarketsToMap = exports.symbolPriceTickersToMap = exports.exchangeInfoSymbolsToMap = exports.binanceStreamToSymbolPrice = exports.getTimestampOfYesterday1AM = exports.getTimestampOfToday1AM = exports.queryStringToSignature = exports.paramsToQueryWithSignature = exports.compareDate = exports.priceToPercent = void 0;
const crypto_1 = require("crypto");
function priceToPercent(p1, p2) {
    return (p2 / p1 - 1) * 100;
}
exports.priceToPercent = priceToPercent;
function compareDate(date1, date2) {
    if (date1 >= date2)
        return -1;
    else
        return 1;
}
exports.compareDate = compareDate;
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
function queryStringToSignature(queryString, binance_api_secret) {
    const hmac = (0, crypto_1.createHmac)("sha256", binance_api_secret);
    hmac.update(queryString);
    const signature = hmac.digest("hex");
    return signature;
}
exports.queryStringToSignature = queryStringToSignature;
function getTimestampOfToday1AM() {
    const now = new Date(); // Get current date and time
    // Check if the current time is between midnight and 1 AM
    if (now.getHours() === 0 &&
        now.getMinutes() >= 0 &&
        now.getMinutes() <= 59 &&
        now.getSeconds() >= 1 &&
        now.getSeconds() <= 59) {
        // If it is, get yesterday's date
        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);
        // Set time to yesterday 1 AM
        yesterday.setHours(1, 0, 0, 0);
        return yesterday.getTime(); // Get timestamp in milliseconds for yesterday 1 AM
    }
    else {
        // If not, get today's date and set time to 1 AM
        const today1AM = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 1, 0, 0, 0);
        return today1AM.getTime(); // Get timestamp in milliseconds for today 1 AM
    }
}
exports.getTimestampOfToday1AM = getTimestampOfToday1AM;
function getTimestampOfYesterday1AM() {
    const now = new Date(); // Get current date and time
    const today1AM = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 1, 0, 0, 0); // Set time to 1 AM
    return today1AM.getTime(); // Get timestamp in milliseconds
}
exports.getTimestampOfYesterday1AM = getTimestampOfYesterday1AM;
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
function orderPiecesToMap(orderPieces) {
    let res = {};
    // lastest order first
    const sortOrders = orderPieces.sort((a, b) => compareDate(a.createdAt, b.createdAt));
    for (let order of sortOrders) {
        let key = order.symbol;
        if (!(key in res)) {
            res[key] = order;
        }
    }
    return res;
}
exports.orderPiecesToMap = orderPiecesToMap;
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
function isSuccess(status) {
    const successStatuss = [200, 201];
    return successStatuss.includes(status) ? true : false;
}
exports.isSuccess = isSuccess;
function filterAblePosition(positions) {
    return positions.filter((pos) => parseFloat(pos.positionAmt) > 0);
}
exports.filterAblePosition = filterAblePosition;
function filterSuccessOrder(newOrders) {
    return newOrders.filter((newOrder) => newOrder.success === true);
}
exports.filterSuccessOrder = filterSuccessOrder;
function filterFailOrder(newOrders) {
    return newOrders.filter((newOrder) => newOrder.success === false);
}
exports.filterFailOrder = filterFailOrder;
// make stackTrace of error shorter
function stackTraceShorter(trace) {
    const traceArr = trace.split("\n    ");
    const firstTrace = traceArr[traceArr.length - 1];
    const secondTrace = traceArr[traceArr.length - 2];
    const thirdTrace = traceArr[traceArr.length - 3];
    return `${firstTrace}  -  ${secondTrace}  -  ${thirdTrace}`;
}
exports.stackTraceShorter = stackTraceShorter;
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
function totalUnrealizedPnl(positions) {
    let result = 0;
    for (let position of positions) {
        result += parseFloat(position.unRealizedProfit);
    }
    return result;
}
exports.totalUnrealizedPnl = totalUnrealizedPnl;
