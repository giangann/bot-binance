"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.data4 = exports.data3 = exports.data2 = exports.data1 = exports.data0 = void 0;
exports.data0 = [
    {
        symbol: "BTCUSDT",
        tickerPrice: "64000",
        marketPrice: "64399",
    },
    {
        symbol: "ETHUSDT",
        tickerPrice: "100",
        marketPrice: "125",
    },
    {
        symbol: "XRPUSDT",
        tickerPrice: "0.125",
        marketPrice: "0.1",
    },
];
exports.data1 = [
    {
        symbol: "BTCUSDT",
        tickerPrice: "70000",
        marketPrice: "74399",
    },
    {
        symbol: "ETHUSDT",
        tickerPrice: "100",
        marketPrice: "185",
    },
];
exports.data2 = [
    {
        symbol: "BTCUSDT",
        tickerPrice: "64000",
        marketPrice: "74399",
    },
    {
        symbol: "ETHUSDT",
        tickerPrice: "100",
        marketPrice: "250",
    },
];
exports.data3 = [
    {
        symbol: "BTCUSDT",
        tickerPrice: "64000",
        marketPrice: "64399",
    },
    {
        symbol: "ETHUSDT",
        tickerPrice: "100",
        marketPrice: "125",
    },
];
exports.data4 = [
    {
        symbol: "BTCUSDT",
        tickerPrice: "64000",
        marketPrice: "64399",
    },
    {
        symbol: "ETHUSDT",
        tickerPrice: "100",
        marketPrice: "150",
    },
    {
        symbol: "XRPUSDT",
        tickerPrice: "0.125",
        marketPrice: "0.117",
    },
];
// 2 array below to test helper function
const itemsInput = [
    {
        createdAt: "2024-08-18T21:34:04.000Z",
        updatedAt: "2024-08-18T21:34:04.000Z",
        id: 30,
        symbol: "BTCUSDT",
        ticker_price: "58000",
        market_price: "58000",
        order: 0,
        datasets_id: 17,
    },
    {
        createdAt: "2024-08-18T21:34:04.000Z",
        updatedAt: "2024-08-18T21:34:04.000Z",
        id: 31,
        symbol: "BCHUSDT",
        ticker_price: "340",
        market_price: "340",
        order: 0,
        datasets_id: 17,
    },
    {
        createdAt: "2024-08-18T21:34:04.000Z",
        updatedAt: "2024-08-18T21:34:04.000Z",
        id: 32,
        symbol: "ETHUSDT",
        ticker_price: "2638",
        market_price: "2638",
        order: 0,
        datasets_id: 17,
    },
    {
        createdAt: "2024-08-18T21:36:35.000Z",
        updatedAt: "2024-08-18T21:36:35.000Z",
        id: 33,
        symbol: "BTCUSDT",
        ticker_price: "58581",
        market_price: "58581",
        order: 1,
        datasets_id: 17,
    },
    {
        createdAt: "2024-08-18T21:36:35.000Z",
        updatedAt: "2024-08-18T21:36:35.000Z",
        id: 34,
        symbol: "BTCUSDT",
        ticker_price: "61511",
        market_price: "61511",
        order: 2,
        datasets_id: 17,
    },
    {
        createdAt: "2024-08-18T21:36:35.000Z",
        updatedAt: "2024-08-18T21:36:35.000Z",
        id: 35,
        symbol: "BTCUSDT",
        ticker_price: "59665.67",
        market_price: "59665.67",
        order: 3,
        datasets_id: 17,
    },
    {
        createdAt: "2024-08-18T21:37:09.000Z",
        updatedAt: "2024-08-18T21:37:09.000Z",
        id: 36,
        symbol: "BTCUSDT",
        ticker_price: "65632.237",
        market_price: "65632.237",
        order: 4,
        datasets_id: 17,
    },
];
const symbolPricesExpect = [
    [
        {
            createdAt: "2024-08-18T21:34:04.000Z",
            updatedAt: "2024-08-18T21:34:04.000Z",
            id: 30,
            symbol: "BTCUSDT",
            ticker_price: "58000",
            market_price: "58000",
            order: 0,
            datasets_id: 17,
        },
        {
            createdAt: "2024-08-18T21:34:04.000Z",
            updatedAt: "2024-08-18T21:34:04.000Z",
            id: 31,
            symbol: "BCHUSDT",
            ticker_price: "340",
            market_price: "340",
            order: 0,
            datasets_id: 17,
        },
        {
            createdAt: "2024-08-18T21:34:04.000Z",
            updatedAt: "2024-08-18T21:34:04.000Z",
            id: 32,
            symbol: "ETHUSDT",
            ticker_price: "2638",
            market_price: "2638",
            order: 0,
            datasets_id: 17,
        },
    ],
    [
        {
            createdAt: "2024-08-18T21:36:35.000Z",
            updatedAt: "2024-08-18T21:36:35.000Z",
            id: 33,
            symbol: "BTCUSDT",
            ticker_price: "58581",
            market_price: "58581",
            order: 1,
            datasets_id: 17,
        },
    ],
    [
        {
            createdAt: "2024-08-18T21:36:35.000Z",
            updatedAt: "2024-08-18T21:36:35.000Z",
            id: 34,
            symbol: "BTCUSDT",
            ticker_price: "61511",
            market_price: "61511",
            order: 2,
            datasets_id: 17,
        },
    ],
    [
        {
            createdAt: "2024-08-18T21:36:35.000Z",
            updatedAt: "2024-08-18T21:36:35.000Z",
            id: 35,
            symbol: "BTCUSDT",
            ticker_price: "59665.67",
            market_price: "59665.67",
            order: 3,
            datasets_id: 17,
        },
    ],
    [
        {
            createdAt: "2024-08-18T21:37:09.000Z",
            updatedAt: "2024-08-18T21:37:09.000Z",
            id: 36,
            symbol: "BTCUSDT",
            ticker_price: "65632.237",
            market_price: "65632.237",
            order: 4,
            datasets_id: 17,
        },
    ],
];
