"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cronJobSchedule = void 0;
const axios_1 = __importDefault(require("axios"));
const node_cron_1 = __importDefault(require("node-cron"));
const coin_service_1 = __importDefault(require("../services/coin.service"));
const db_connect_1 = require("./db-connect");
const futureTestnetUrl = "https://testnet.binancefuture.com";
const futureUrl = "https://fapi.binance.com";
const coinTestnetService = new coin_service_1.default(true);
const coinFutureService = new coin_service_1.default(false);
const cronJobSchedule = () => __awaiter(void 0, void 0, void 0, function* () {
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
});
exports.cronJobSchedule = cronJobSchedule;
function updateCoinTestnetTableTickerPriceCol() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const symbolPriceTickersNow = yield getSymbolPriceTickers(futureTestnetUrl);
            const updatedCoins = yield Promise.all(symbolPriceTickersNow.map((symbolPrice) => {
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
    });
}
function updateCoinTestnetTableMarkPriceCol() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const symbolMarkPrice = yield getSymbolMarketPrices(futureTestnetUrl);
            const updatedCoins = yield Promise.all(symbolMarkPrice.map((symbolPrice) => {
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
    });
}
function updateCoinFutureTableTickerPriceCol() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const symbolPriceTickersNow = yield getSymbolPriceTickers(futureUrl);
            const updatedCoins = yield Promise.all(symbolPriceTickersNow.map((symbolPrice) => {
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
    });
}
function updateCoinFutureTableMarkPriceCol() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const symbolMarkPrice = yield getSymbolMarketPrices(futureUrl);
            const updatedCoins = yield Promise.all(symbolMarkPrice.map((symbolPrice) => {
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
    });
}
const getSymbolPriceTickers = (baseUrl) => __awaiter(void 0, void 0, void 0, function* () {
    const endpoint = "/fapi/v2/ticker/price";
    const url = `${baseUrl}${endpoint}`;
    const response = yield axios_1.default.get(url);
    const tickersPrice = response.data;
    return tickersPrice;
});
const getSymbolMarketPrices = (baseUrl) => __awaiter(void 0, void 0, void 0, function* () {
    const endpoint = "/fapi/v1/premiumIndex";
    const url = `${baseUrl}${endpoint}`;
    const response = yield axios_1.default.get(url);
    const markPrices = response.data;
    return markPrices;
});
const test = () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, db_connect_1.connectDatabase)();
    // testnet
    yield updateCoinTestnetTableMarkPriceCol();
    yield updateCoinTestnetTableTickerPriceCol();
    // future
    yield updateCoinFutureTableTickerPriceCol();
    yield updateCoinFutureTableMarkPriceCol();
});
// test();
