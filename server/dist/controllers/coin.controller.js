"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const coin_service_1 = __importDefault(require("../services/coin.service"));
const axios_1 = __importDefault(require("axios"));
const helper_ultil_1 = require("../ultils/helper.ultil");
const server_response_ultil_1 = require("../ultils/server-response.ultil");
const testnetUrl = "https://testnet.binancefuture.com";
const futureUrl = "https://fapi.binance.com";
const updatePrice = async (req, res) => {
    try {
        // update Testnet table
        const testnetUpdated = await updatePriceTable(true);
        // update Future table
        const futureUpdated = await updatePriceTable(false);
        server_response_ultil_1.ServerResponse.response(res, { testnetUpdated, futureUpdated });
    }
    catch (err) {
        server_response_ultil_1.ServerResponse.error(res, err.message);
    }
};
// Logic of update:
// 1. Truncate table
// 2. Fetch data Api
// 3. Insert fetched data from Api to table
async function updatePriceTable(isTestnet) {
    const coinService = new coin_service_1.default(isTestnet);
    // fetch data api
    const symbolMarkPrices = await fetchMarkPrices(isTestnet);
    const symbolTickerPrices = await fetchTickerPrices(isTestnet);
    // truncate
    await coinService.truncate();
    // insert data
    const mergePrices = (0, helper_ultil_1.mergeTicerPriceAndMarketPriceBySymbol)(symbolTickerPrices, symbolMarkPrices);
    const createdDatas = await Promise.all(mergePrices.map((price) => {
        const params = {
            symbol: price.symbol,
            price: price.price,
            mark_price: price.markPrice,
        };
        coinService.create(params);
    }));
    return createdDatas;
}
async function fetchMarkPrices(isTestnet) {
    const endpoint = "/fapi/v1/premiumIndex";
    const url = `${isTestnet ? testnetUrl : futureUrl}${endpoint}`;
    const response = await axios_1.default.get(url);
    const markPrices = response.data;
    return markPrices;
}
async function fetchTickerPrices(isTestnet) {
    const endpoint = "/fapi/v2/ticker/price";
    const url = `${isTestnet ? testnetUrl : futureUrl}${endpoint}`;
    const response = await axios_1.default.get(url);
    const tickersPrice = response.data;
    return tickersPrice;
}
exports.default = { updatePrice };
