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
const helper_ultil_1 = require("../ultils/helper.ultil");
const logger_config_1 = require("./logger.config");
const createInterval = () => {
    const interval = setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
        console.log("start tick");
        try {
            // fetch binance account info and emit to client
            const accInfo = yield binance_service_1.default.getAccountInfo();
            global.wsServerGlob.emit("ws-account-info", accInfo);
            // fetch position info and emit to client
            const positions = yield binance_service_1.default.getPositions();
            global.wsServerGlob.emit("ws-position", positions);
            // fetch symbolPriceTickers now
            const symbolPriceTickers = yield binance_service_1.default.getSymbolPriceTickers();
            const symbolPriceTickersMap = (0, helper_ultil_1.symbolPriceTickersToMap)(symbolPriceTickers);
            global.wsServerGlob.emit("symbols-price", symbolPriceTickers);
            // fetch exchange info
            const exchangeInfo = yield binance_service_1.default.getExchangeInfo();
            const exchangeInfoSymbolsMap = (0, helper_ultil_1.exchangeInfoSymbolsToMap)(exchangeInfo.symbols);
            // fetch chain open
            const openChain = yield getChainOpen();
            if (openChain) {
                // fetch symbolPriceTickers 1AM from DB
                const symbolPriceTickers1Am = yield binance_service_1.default.getSymbolPriceTickers1Am();
                const symbolPriceTickers1AmMap = (0, helper_ultil_1.symbolPriceTickersToMap)(symbolPriceTickers1Am);
                // // fetch list position
                const positionsMap = (0, helper_ultil_1.positionsToMap)(positions);
                // orderPieces of current order chain
                const orderPiecesMap = (0, helper_ultil_1.orderPiecesToMap)(openChain.order_pieces);
                // gen order params
                const orderParams = genMarketOrderParams(symbolPriceTickersMap, symbolPriceTickers1AmMap, positionsMap, orderPiecesMap, openChain, exchangeInfoSymbolsMap);
                const createdOrders = yield makeOrders(orderParams);
                const successOrders = filterOrder(createdOrders, true);
                const failureOrders = filterOrder(createdOrders, false);
                const successOrdersData = successOrders.map((order) => {
                    return order.data;
                });
                const logParmas = genLogParams(failureOrders, openChain.id);
                yield saveLogs(logParmas);
                const orderPieceParams = genOrderPieceParams(successOrdersData, orderParams, openChain.id);
                yield saveOrderPieces(orderPieceParams);
                // save success order to debug log
                saveOrderDebugLog(successOrdersData, orderParams, openChain.id);
                global.wsServerGlob.emit("bot-tick", orderParams.length, successOrders.length, failureOrders.length);
            }
        }
        catch (err) {
            const appErr = { name: err.name, message: err.message };
            global.wsServerGlob.emit("app-err", JSON.stringify(appErr));
            logger_config_1.logger.error(err.message);
        }
        console.log("emit and end tick");
    }), 10000);
    global.tickInterval = interval;
};
exports.createInterval = createInterval;
function genMarketOrderParams(symbolPriceTickersMap, symbolPriceTickers1AmMap, positionsMap, orderPiecesMap, openChain, exchangeInfoSymbolsMap) {
    var _a, _b, _c;
    try {
        const { percent_to_first_buy, percent_to_buy, percent_to_sell, transaction_size_start, } = openChain;
        let orderParams = [];
        // loop through symbolPriceTickers
        const symbols = Object.keys(symbolPriceTickersMap);
        for (let symbol of symbols) {
            // get prev price and current price
            let prevPrice = parseFloat((_a = symbolPriceTickers1AmMap[symbol]) === null || _a === void 0 ? void 0 : _a.price);
            let todayLatestOrder = orderPiecesMap[symbol];
            const hasOrderToday = Boolean(todayLatestOrder);
            if (todayLatestOrder) {
                prevPrice = parseFloat(todayLatestOrder.price);
            }
            let currPrice = parseFloat((_b = symbolPriceTickersMap[symbol]) === null || _b === void 0 ? void 0 : _b.price);
            // check if need to skip, continue to next symbol
            if (!prevPrice || !currPrice) {
                continue;
            }
            // calculate percentChange
            const percent_change = (currPrice / prevPrice - 1) * 100;
            // get position
            let position = positionsMap[symbol]; // positions just have symbol that positionAmt > 0
            let positionAmt = parseFloat(position === null || position === void 0 ? void 0 : position.positionAmt);
            // direction and order_size intitial
            let direction = "";
            let amount = transaction_size_start / currPrice;
            // direction calculate
            const isFirstBuy = percent_change >= parseFloat(percent_to_first_buy) &&
                hasOrderToday === false;
            if (percent_change <= parseFloat(percent_to_sell))
                direction = "SELL";
            if (percent_change >= parseFloat(percent_to_buy) || isFirstBuy)
                direction = "BUY";
            if (direction === "")
                continue;
            // order_size calculate
            if (direction === "SELL") {
                if (!position || !positionAmt)
                    continue;
                amount = positionAmt / 2;
            }
            if (direction === "BUY") {
                if (!position || !positionAmt) {
                    if (isFirstBuy)
                        amount = transaction_size_start / currPrice;
                    else
                        continue;
                }
                if (position && positionAmt)
                    amount = positionAmt;
            }
            // amount precision
            const quantityPrecision = (_c = exchangeInfoSymbolsMap[symbol]) === null || _c === void 0 ? void 0 : _c.quantityPrecision;
            orderParams.push({
                amount: (0, helper_ultil_1.validateAmount)(amount, quantityPrecision),
                direction,
                symbol,
                percent: percent_change,
                order_size: Math.round(amount * currPrice),
                price_ticker: currPrice,
                positionAmt,
            });
        }
        console.log("total generated params: ", orderParams.length, " orders");
        return orderParams;
    }
    catch (err) {
        console.log(err);
    }
}
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
// log success order
function saveOrderDebugLog(...args) {
    const [newOrders, orderParams, chainId] = args;
    for (let newOrder of newOrders) {
        for (let orderParam of orderParams) {
            if ((newOrder === null || newOrder === void 0 ? void 0 : newOrder.symbol) === orderParam.symbol) {
                const { orderId, side, origQty, symbol } = newOrder;
                const { positionAmt } = orderParam;
                let newDebugLog = `chainId: ${chainId}; `;
                newDebugLog = `create new order: ${orderId} ${side} ${origQty} ${symbol}`;
                if (side === "SELL")
                    newDebugLog += ` before order has ${positionAmt} ${symbol}`;
                logger_config_1.logger.debug(newDebugLog);
            }
        }
    }
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
