"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.binanceStreamToSymbolPrice = exports.getTimestampOfToday1AM = exports.queryStringToSignature = exports.paramsToQueryWithSignature = exports.compareDate = exports.priceToPercent = void 0;
const crypto_1 = require("crypto");
function priceToPercent(p1, p2) {
    if (p1 < p2)
        return (p2 / p1 - 1) * 100;
    else
        return -(p1 / p2 - 1) * 100;
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
    const today1AM = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 1, 0, 0, 0); // Set time to 1 AM
    return today1AM.getTime(); // Get timestamp in milliseconds
}
exports.getTimestampOfToday1AM = getTimestampOfToday1AM;
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
