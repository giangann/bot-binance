"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMockPrices = exports.LIMIT_SYMBOLS = exports.openingChainTest = exports.openingChain = exports.positions0 = exports.mock = void 0;
const price_data_1 = require("./price-data");
exports.mock = [
    {
        tick: 1,
        data: price_data_1.data1,
    },
    {
        tick: 2,
        data: price_data_1.data2,
    },
    {
        tick: 3,
        data: price_data_1.data3,
    },
    {
        tick: 4,
        data: price_data_1.data4,
    },
];
exports.positions0 = [
// {
//   symbol: "BTCUSDT",
//   positionAmt: "0",
//   unrealizedPnl: "0",
// },
// {
//   symbol: "XRPUSDT",
//   positionAmt: "0",
//   unrealizedPnl: "0",
// },
// {
//   symbol: "ETHUSDT",
//   positionAmt: "0",
//   unrealizedPnl: "0",
// },
];
exports.openingChain = {
    percent_to_buy: "5",
    percent_to_first_buy: "1",
    percent_to_sell: "-2.5",
    transaction_size_start: "10",
    pnl_to_stop: "-5",
};
exports.openingChainTest = {
    percent_to_buy: "5",
    percent_to_first_buy: "1",
    percent_to_sell: "-2.5",
    transaction_size_start: "10",
    pnl_to_stop: "-5",
    datasets_id: 18,
};
// export const ableSymbols: string[] = ["BTCUSDT", "BCHUSDT", "ETHUSDT"];
exports.LIMIT_SYMBOLS = ["BTCUSDT", "ETHUSDT"];
exports.getMockPrices = (() => {
    let index = 0;
    const resetIndex = () => {
        index = 0;
    };
    const getPrices = () => {
        const prices = exports.mock[index]?.data;
        index++;
        return prices;
    };
    return {
        getPrices,
        resetIndex,
    };
})();
