"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cronJobSchedule = void 0;
const axios_1 = __importDefault(require("axios"));
const node_cron_1 = __importDefault(require("node-cron"));
const coin_service_1 = __importDefault(require("../services/coin.service"));
const futureTestnetUrl = "https://testnet.binancefuture.com";
const futureUrl = "https://fapi.binance.com";
const coinTestnetService = new coin_service_1.default(true);
const coinFutureService = new coin_service_1.default(false);
const cronJobSchedule = async () => {
    console.log("cron job file");
    const task = node_cron_1.default.schedule("0 0 1 * * *", () => {
        console.log("task run");
        // testnet
        updateCoinTestnetTableMarkPriceCol();
        updateCoinTestnetTableTickerPriceCol();
        // future
        updateCoinFutureTableTickerPriceCol();
        updateCoinFutureTableMarkPriceCol();
    }, {
        scheduled: false,
        timezone: "Asia/Ho_Chi_Minh",
    });
    task.start();
};
exports.cronJobSchedule = cronJobSchedule;
async function updateCoinTestnetTableTickerPriceCol() {
    try {
        const symbolPriceTickersNow = await getSymbolPriceTickers(futureTestnetUrl);
        const updatedCoins = await Promise.all(symbolPriceTickersNow.map((symbolPrice) => {
            return coinTestnetService.update({
                symbol: symbolPrice.symbol,
                price: symbolPrice.price,
            });
        }));
        return updatedCoins;
    }
    catch (err) {
        console.log(err);
    }
}
async function updateCoinTestnetTableMarkPriceCol() {
    try {
        const symbolMarkPrice = await getSymbolMarketPrices(futureTestnetUrl);
        const updatedCoins = await Promise.all(symbolMarkPrice.map((symbolPrice) => {
            return coinTestnetService.update({
                symbol: symbolPrice.symbol,
                mark_price: symbolPrice.markPrice,
            });
        }));
        return updatedCoins;
    }
    catch (err) {
        console.log(err);
    }
}
async function updateCoinFutureTableTickerPriceCol() {
    try {
        const symbolPriceTickersNow = await getSymbolPriceTickers(futureUrl);
        const updatedCoins = await Promise.all(symbolPriceTickersNow.map((symbolPrice) => {
            return coinFutureService.update({
                symbol: symbolPrice.symbol,
                price: symbolPrice.price,
            });
        }));
        return updatedCoins;
    }
    catch (err) {
        console.log(err);
    }
}
async function updateCoinFutureTableMarkPriceCol() {
    try {
        const symbolMarkPrice = await getSymbolMarketPrices(futureUrl);
        const updatedCoins = await Promise.all(symbolMarkPrice.map((symbolPrice) => {
            return coinFutureService.update({
                symbol: symbolPrice.symbol,
                mark_price: symbolPrice.markPrice,
            });
        }));
        return updatedCoins;
    }
    catch (err) {
        console.log(err);
    }
}
const getSymbolPriceTickers = async (baseUrl) => {
    const endpoint = "/fapi/v2/ticker/price";
    const url = `${baseUrl}${endpoint}`;
    const response = await axios_1.default.get(url);
    const tickersPrice = response.data;
    return tickersPrice;
};
const getSymbolMarketPrices = async (baseUrl) => {
    const endpoint = "/fapi/v1/premiumIndex";
    const url = `${baseUrl}${endpoint}`;
    const response = await axios_1.default.get(url);
    const markPrices = response.data;
    return markPrices;
};
