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
exports.createInterval = void 0;
const binance_service_1 = __importDefault(require("../services/binance.service"));
const log_service_1 = __importDefault(require("../services/log.service"));
const market_order_chain_service_1 = __importDefault(require("../services/market-order-chain.service"));
const market_order_piece_service_1 = __importDefault(require("../services/market-order-piece.service"));
const db_connect_1 = require("./db-connect");
const createInterval = () => {
    const interval = setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
        console.log("start tick");
        try {
            // fetch symbolPriceTickers now
            const symbolPriceTickers = yield binance_service_1.default.getSymbolPriceTickers();
            const symbolPriceTickersMap = symbolPriceTickersToMap(symbolPriceTickers);
            global.wsServerGlob.emit("symbols-price", symbolPriceTickers);
            // fetch chain open
            const openChain = yield getChainOpen();
            if (openChain) {
                // fetch symbolPriceTickers 1AM from DB
                const symbolPriceTickers1Am = yield binance_service_1.default.getSymbolPriceTickers1Am();
                const symbolPriceTickers1AmMap = symbolPriceTickersToMap(symbolPriceTickers1Am);
                // // fetch list position
                const positions = yield binance_service_1.default.getPositions();
                const positionsMap = positionsToMap(positions);
                // // fetch list Orders Today
                const ordersFrom1Am = yield binance_service_1.default.getOrdersFromToday1Am();
                const ordersFrom1AmMap = ordersToMap(ordersFrom1Am); // last order of each symbol
                // gen order params
                const orderParams = genMarketOrderParams(symbolPriceTickersMap, symbolPriceTickers1AmMap, positionsMap, ordersFrom1AmMap, openChain);
                const createdOrders = yield makeOrders(orderParams);
                const successOrders = filterOrder(createdOrders, true);
                const failureOrders = filterOrder(createdOrders, false);
                console.log("success orders: ", successOrders, " failedOrders: ", failureOrders);
                console.log("success orders: ", successOrders.length, " failedOrders: ", failureOrders.length);
                const successOrdersData = successOrders.map((order) => {
                    return order.data;
                });
                const logParmas = genLogParams(failureOrders, openChain.id);
                yield saveLogs(logParmas);
                const orderPieceParams = genOrderPieceParams(successOrdersData, orderParams, openChain.id);
                yield saveOrderPieces(orderPieceParams);
                global.wsServerGlob.emit("bot-tick", orderParams.length, successOrders.length, failureOrders.length);
            }
            // fetch balance in account
            // const accInfo = await binanceService.getAccountInfo();
            // const { totalWalletBalance, availableBalance } = accInfo;
            // global.wsServerGlob.emit(
            //   "ws-balance",
            //   totalWalletBalance,
            //   availableBalance
            // );
        }
        catch (err) {
            console.log("err", err);
            log_service_1.default.create({
                market_order_chains_id: 0,
                message: JSON.stringify(err),
                type: "app-err",
            });
            global.wsServerGlob.emit("app-err", err.message);
        }
        console.log("emit and end tick");
    }), 10000);
    global.tickInterval = interval;
};
exports.createInterval = createInterval;
const test = () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, db_connect_1.connectDatabase)();
    try {
        // fetch chain open
        const openChain = yield getChainOpen();
        if (openChain) {
            // fetch symbolPriceTickers now
            const symbolPriceTickers = yield binance_service_1.default.getSymbolPriceTickers();
            const symbolPriceTickersMap = symbolPriceTickersToMap(symbolPriceTickers);
            // fetch symbolPriceTickers 1AM from DB
            const symbolPriceTickers1Am = yield binance_service_1.default.getSymbolPriceTickers1Am();
            const symbolPriceTickers1AmMap = symbolPriceTickersToMap(symbolPriceTickers1Am);
            // // fetch list position
            const positions = yield binance_service_1.default.getPositions();
            const positionsMap = positionsToMap(positions);
            // // fetch list Orders Today
            const ordersFrom1Am = yield binance_service_1.default.getOrdersFromToday1Am();
            const ordersFrom1AmMap = ordersToMap(ordersFrom1Am); // last order of each symbol
            // gen order params
            const orderParams = genMarketOrderParams(symbolPriceTickersMap, symbolPriceTickers1AmMap, positionsMap, ordersFrom1AmMap, openChain);
            const createdOrders = yield makeOrders(orderParams);
            const successOrders = filterOrder(createdOrders, true);
            const failureOrders = filterOrder(createdOrders, false);
            console.log("success orders: ", successOrders, " failedOrders: ", failureOrders);
            console.log("success orders: ", successOrders.length, " failedOrders: ", failureOrders.length);
            const successOrdersData = successOrders.map((order) => {
                return order.data;
            });
            const logParmas = genLogParams(failureOrders, openChain.id);
            yield saveLogs(logParmas);
            const orderPieceParams = genOrderPieceParams(successOrdersData, orderParams, openChain.id);
            yield saveOrderPieces(orderPieceParams);
        }
    }
    catch (err) {
        console.log("err", err);
        // global.wsServerGlob.emit("app-err", err.message);
    }
});
function makeOrders(orderParams) {
    return __awaiter(this, void 0, void 0, function* () {
        const promises = orderParams.map((param) => __awaiter(this, void 0, void 0, function* () {
            const { symbol, amount, direction } = param;
            try {
                return yield binance_service_1.default.createMarketOrder(symbol, direction, amount);
            }
            catch (error) {
                console.log("error", error);
            }
        }));
        return Promise.all(promises);
    });
}
function genOrderPieceParams(newOrders, orderParams, chainId) {
    let orderPieceParams = [];
    for (let newOrder of newOrders) {
        for (let orderParam of orderParams) {
            if ((newOrder === null || newOrder === void 0 ? void 0 : newOrder.symbol) === orderParam.symbol) {
                let orderPiceParam = {
                    id: newOrder.orderId.toString(),
                    market_order_chains_id: chainId,
                    amount: orderParam.amount.toString(),
                    direction: orderParam.direction,
                    percent_change: orderParam.percent.toFixed(5),
                    symbol: orderParam.symbol,
                    price: orderParam.price_ticker.toString(),
                    total_balance: "0.00", // can't defined
                    transaction_size: orderParam.order_size.toString(),
                };
                orderPieceParams.push(orderPiceParam);
            }
        }
    }
    return orderPieceParams;
}
function saveOrderPieces(orderPieceParams) {
    return __awaiter(this, void 0, void 0, function* () {
        return Promise.all(orderPieceParams.map((param) => __awaiter(this, void 0, void 0, function* () {
            return yield market_order_piece_service_1.default.create(param);
        })));
    });
}
function genLogParams(failedOrders, chainId) {
    let params = [];
    for (let failedOrder of failedOrders) {
        let { error: { code, msg }, } = failedOrder;
        let orderInfo = failedOrder === null || failedOrder === void 0 ? void 0 : failedOrder.payload;
        params.push({
            message: `code: ${code}, message: ${msg}, ${JSON.stringify(orderInfo)}`,
            market_order_chains_id: chainId,
            type: "order-err",
        });
    }
    return params;
}
function saveLogs(logParams) {
    return __awaiter(this, void 0, void 0, function* () {
        return Promise.all(logParams.map((param) => __awaiter(this, void 0, void 0, function* () {
            return yield log_service_1.default.create(param);
        })));
    });
}
function filterOrder(newOrders, success) {
    return newOrders.filter((newOrder) => newOrder.success === success);
}
// if order with same symbol, get only 1 latest order
function getChainOpen() {
    return __awaiter(this, void 0, void 0, function* () {
        const openChain = yield market_order_chain_service_1.default.list({ status: "open" });
        if (openChain.length)
            return openChain[0];
        else
            return null;
    });
}
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
function ordersToMap(orders) {
    let res = {};
    // lastest order first
    const sortOrders = orders.sort((a, b) => b.time - a.time);
    for (let order of sortOrders) {
        let key = order.symbol;
        if (!(key in res)) {
            res[key] = order;
        }
    }
    return res;
}
function genMarketOrderParams(symbolPriceTickersMap, symbolPriceTickers1AmMap, positionsMap, ordersFrom1AmMap, openChain) {
    var _a, _b;
    try {
        const { percent_to_buy, percent_to_sell, transaction_size_start } = openChain;
        let orderParams = [];
        // loop through symbolPriceTickers
        const symbols = Object.keys(symbolPriceTickersMap);
        for (let symbol of symbols) {
            // get prev price
            let prevPrice = parseFloat((_a = symbolPriceTickers1AmMap[symbol]) === null || _a === void 0 ? void 0 : _a.price);
            // check to day has order
            let todayLatestOrder = ordersFrom1AmMap[symbol];
            if (todayLatestOrder) {
                prevPrice = parseFloat(todayLatestOrder.avgPrice);
            }
            // get current price
            let currPrice = parseFloat((_b = symbolPriceTickersMap[symbol]) === null || _b === void 0 ? void 0 : _b.price);
            // check if need to skip, continue to next symbol
            if (!prevPrice || !currPrice) {
                continue;
            }
            // calculate percentChange
            const percent_change = (currPrice / prevPrice - 1) * 100;
            // direction and order_size
            let direction = "";
            let order_size = transaction_size_start;
            if (percent_change <= parseFloat(percent_to_sell)) {
                direction = "SELL";
                if (todayLatestOrder) {
                    let prevSize = parseFloat(todayLatestOrder.avgPrice) *
                        parseFloat(todayLatestOrder.origQty);
                    order_size = prevSize / 2;
                }
            }
            if (percent_change >= parseFloat(percent_to_buy)) {
                direction = "BUY";
                if (todayLatestOrder) {
                    let prevSize = parseFloat(todayLatestOrder.avgPrice) *
                        parseFloat(todayLatestOrder.origQty);
                    order_size = prevSize * 2;
                }
            }
            let amount = order_size / currPrice;
            if (direction !== "") {
                // check if amount able
                if (direction === "SELL") {
                    const currPosition = positionsMap[symbol];
                    if (currPosition) {
                        const positionAmt = parseFloat(currPosition.positionAmt);
                        if (!positionAmt)
                            continue; // if don't have this position so skip
                        if (positionAmt < amount)
                            amount = positionAmt;
                    }
                }
                orderParams.push({
                    amount: validateAmount(amount),
                    direction,
                    symbol,
                    percent: percent_change,
                    order_size,
                    price_ticker: currPrice,
                });
                console.log("symbol: ", symbol, " today has order: ", Boolean(todayLatestOrder), " prevPrice: ", prevPrice.toFixed(3), " currPrice: ", currPrice.toFixed(3), " percentChange: ", percent_change, " direction: ", direction, " size: ", order_size, " amont: ", amount);
            }
        }
        console.log("total", orderParams.length, " orders");
        return orderParams;
    }
    catch (err) {
        console.log(err);
    }
}
function validateAmount(amount) {
    if (amount >= 1)
        return Math.round(amount);
    if (amount < 1)
        return Math.round(amount * 1e3) / 1e3;
}
