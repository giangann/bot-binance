"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.genWsMessageToClient = void 0;
const moment_1 = __importDefault(require("moment"));
// Function to generate a random float within a range
const getRandomFloat = (min, max, decimals = 2) => {
    const str = (Math.random() * (max - min) + min).toFixed(decimals);
    return parseFloat(str);
};
// Function to generate a random integer within a range
const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
// Function to generate random data
const genWsMessageToClient = () => {
    const symbols = ["BTCUSDT", "ETHUSDT", "BNBUSDT", "ADAUSDT"];
    const directions = ["BUY", "SELL"];
    const randomSymbol = symbols[getRandomInt(0, symbols.length - 1)];
    const randomDirection = directions[getRandomInt(0, directions.length - 1)];
    return {
        id: `00${getRandomInt(2, 99)}`, // Generate a random id like "002", "003", etc.
        symbol: randomSymbol,
        direction: randomDirection,
        quantity: getRandomFloat(0.001, 10, 3).toString(),
        price: getRandomFloat(1000, 50000, 2).toString(),
        percent_change: getRandomFloat(-10, 10, 2).toString(),
        transaction_size: getRandomFloat(0, 1000, 2).toString(),
        market_order_chains_id: global.openingChain.id, // keep this
        order_chain: global.openingChain,
        timestamp: Date.now().toString(),
        total_balance: getRandomFloat(0, 100, 2).toString(),
        createdAt: (0, moment_1.default)(Date.now()).format("DD/MM/YYYY HH:mm:ss"),
        updatedAt: (0, moment_1.default)(Date.now()).format("DD/MM/YYYY HH:mm:ss"),
    };
};
exports.genWsMessageToClient = genWsMessageToClient;
