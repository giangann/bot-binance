"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInterval = void 0;
const binance_service_1 = __importDefault(require("../services/binance.service"));
const log_service_1 = __importDefault(require("../services/log.service"));
const logger_service_1 = __importDefault(require("../services/logger.service"));
const market_order_chain_service_1 = __importDefault(require("../services/market-order-chain.service"));
const market_order_piece_service_1 = __importDefault(require("../services/market-order-piece.service"));
const error_handler_ultil_1 = require("../ultils/error-handler.ultil");
const helper_ultil_1 = require("../ultils/helper.ultil");
const createInterval = () => {
    const interval = setInterval(async () => {
    const interval = setInterval(async () => {
        console.log("start tick");
        try {
            // fetch statistic
            const accInfo = await binance_service_1.default.getAccountInfo();
            const positions = await binance_service_1.default.getPositions();
            const tickers = await binance_service_1.default.getSymbolPriceTickers();
            const { symbols } = await binance_service_1.default.getExchangeInfo();
            global.wsServerGlob.emit("ws-account-info", accInfo);
            global.wsServerGlob.emit("ws-position", positions);
            global.wsServerGlob.emit("symbols-price", tickers);
            // fetch chain open
            const openChain = await getChainOpen();
            const openChain = await getChainOpen();
            if (openChain) {
                // fetch symbolPriceTickers 1AM from DB
                const tickers1AM = await binance_service_1.default.getSymbolPriceTickers1Am();
                // storage statistic in Object
                const symbolPriceTickersMap = (0, helper_ultil_1.symbolPriceTickersToMap)(tickers);
                const exchangeInfoSymbolsMap = (0, helper_ultil_1.exchangeInfoSymbolsToMap)(symbols);
                const symbolPriceTickers1AmMap = (0, helper_ultil_1.symbolPriceTickersToMap)(tickers1AM);
                const positionsMap = (0, helper_ultil_1.positionsToMap)(positions);
                const orderPiecesMap = (0, helper_ultil_1.orderPiecesToMap)(openChain.order_pieces);
                // gen order params
                const genOrderParamsArgs = [
                    symbolPriceTickersMap,
                    symbolPriceTickers1AmMap,
                    positionsMap,
                    orderPiecesMap,
                    openChain,
                    exchangeInfoSymbolsMap,
                ];
                const orderInfos = genOrderInfoArray(...genOrderParamsArgs);
                // make order and handle response
                const createdOrders = await makeOrders(orderInfos);
                const successOrders = (0, helper_ultil_1.filterSuccessOrder)(createdOrders);
                const failureOrders = (0, helper_ultil_1.filterFailOrder)(createdOrders);
                const successOrdersData = successOrders.map((order) => order.data);
                // save failure orders to bot_binance.logs database table
                const logParmas = genLogParams(failureOrders, openChain.id);
                await saveLogs(logParmas);
                // merge successOrders to bot_binance.market_order_pieces database table
                const mergedOrders = mergeOrders(orderInfos, successOrdersData);
                // save success orders to
                const orderPiecesInfo = [
                    mergedOrders,
                    openChain.id,
                ];
                const orderPieceParams = genOrderPieceParams(...orderPiecesInfo);
                await saveOrderPieces(orderPieceParams);
                // Side Effect: save success order to debug log
                saveOrderDebugLog(mergedOrders, openChain.id);
                // ws emit result of tick
                global.wsServerGlob.emit("bot-tick", orderInfos.length, successOrders.length, failureOrders.length);
            }
        }
        catch (err) {
            (0, error_handler_ultil_1.handleTickError)(err);
        }
        console.log("emit and end tick");
    }, 10000);
};
exports.createInterval = createInterval;
function genOrderInfoArray(symbolPriceTickersMap, symbolPriceTickers1AmMap, positionsMap, orderPiecesMap, openChain, exchangeInfoSymbolsMap) {
    try {
        const { percent_to_first_buy, percent_to_buy, percent_to_sell, transaction_size_start, } = openChain;
        let orderInfoArray = [];
        // loop through symbolPriceTickers
        const symbols = Object.keys(symbolPriceTickersMap);
        for (let symbol of symbols) {
            // get prev price and current price
            let prevPrice = parseFloat(symbolPriceTickers1AmMap[symbol]?.price);
            let prevPrice = parseFloat(symbolPriceTickers1AmMap[symbol]?.price);
            let todayLatestOrder = orderPiecesMap[symbol];
            const hasOrderToday = Boolean(todayLatestOrder);
            if (todayLatestOrder) {
                prevPrice = parseFloat(todayLatestOrder.price);
            }
            let currPrice = parseFloat(symbolPriceTickersMap[symbol]?.price);
            let currPrice = parseFloat(symbolPriceTickersMap[symbol]?.price);
            // check if need to skip, continue to next symbol
            if (!prevPrice || !currPrice) {
                continue;
            }
            // calculate percentChange
            const percentChange = (currPrice / prevPrice - 1) * 100;
            // get position
            let position = positionsMap[symbol]; // positions just have symbol that positionAmt > 0
            let positionAmt = parseFloat(position?.positionAmt);
            let positionAmt = parseFloat(position?.positionAmt);
            // direction and order_size intitial
            let direction = "";
            let quantity = transaction_size_start / currPrice;
            // direction calculate
            const isFirstBuy = percentChange >= parseFloat(percent_to_first_buy) &&
                hasOrderToday === false;
            if (percentChange <= parseFloat(percent_to_sell))
                direction = "SELL";
            if (percentChange >= parseFloat(percent_to_buy) || isFirstBuy)
                direction = "BUY";
            if (direction === "")
                continue;
            // order_size calculate
            if (direction === "SELL") {
                if (!position || !positionAmt)
                    continue;
                quantity = positionAmt / 2;
            }
            if (direction === "BUY") {
                // if percent change is able to BUY:
                // 1. check if is first buy, if first buy so alway buy with amount = transaction_size_start
                // 2. if not first buy, check the current positionAmt of symbol, quantity = positionAmt
                if (isFirstBuy)
                    quantity = transaction_size_start / currPrice;
                if (!isFirstBuy) {
                    if (!position || !positionAmt)
                        quantity = positionAmt;
                    else
                        quantity = transaction_size_start / currPrice;
                }
            }
            // order params:
            const quantityPrecision = exchangeInfoSymbolsMap[symbol]?.quantityPrecision;
            quantity = (0, helper_ultil_1.validateAmount)(quantity, quantityPrecision);
            const orderParam = {
                symbol,
                direction,
                quantity,
            };
            // order reason:
            const orderReason = {
                isFirstOrder: !hasOrderToday,
                currPrice,
                prevPrice,
                percentChange,
                positionAmt,
            };
            // more info:
            const orderMoreInfo = {
                amount: quantity * currPrice,
                quantityPrecision
            };
            // add to array
            orderInfoArray.push({ ...orderParam, ...orderReason, ...orderMoreInfo });
        }
        return orderInfoArray;
    }
    catch (err) {
        (0, error_handler_ultil_1.throwError)(err);
    }
}
async function makeOrders(orderInfos) {
    const promises = orderInfos.map((info) => {
        const { symbol, quantity, direction } = info;
        return binance_service_1.default.createMarketOrder(symbol, direction, quantity);
    });
    return Promise.all(promises);
    return Promise.all(promises);
}
function genOrderPieceParams(mergedOrders, chainId) {
    return mergedOrders.map((mergedOrder) => {
        const { orderId, quantity, direction, percentChange, symbol, currPrice, amount, } = mergedOrder;
        return {
            id: orderId.toString(),
            market_order_chains_id: chainId,
            quantity: quantity.toString(),
            direction: direction,
            percent_change: percentChange.toFixed(5),
            symbol: symbol,
            price: currPrice.toString(),
            total_balance: "0.00", // can't defined
            transaction_size: amount.toString(),
        };
    });
}
async function saveOrderPieces(orderPieceParams) {
    return Promise.all(orderPieceParams.map(async (param) => {
        return await market_order_piece_service_1.default.create(param);
    }));
}
function genLogParams(failedOrders, chainId) {
    let params = [];
    for (let failedOrder of failedOrders) {
        let { error: { code, msg }, } = failedOrder;
        let orderInfo = failedOrder?.payload;
        let orderInfo = failedOrder?.payload;
        params.push({
            message: `code: ${code}, message: ${msg}, ${JSON.stringify(orderInfo)}`,
            market_order_chains_id: chainId,
            type: "order-err",
        });
    }
    return params;
}
async function saveLogs(logParams) {
    return Promise.all(logParams.map(async (param) => {
        return await log_service_1.default.create(param);
    }));
}
function saveOrderDebugLog(mergedOrders, chainId) {
    mergedOrders.forEach((mergedOrder) => {
        logger_service_1.default.saveOrderLog(mergedOrder, chainId);
    });
}
// if order with same symbol, get only 1 latest order
async function getChainOpen() {
    const openChain = await market_order_chain_service_1.default.list({ status: "open" });
    if (openChain.length)
        return openChain[0];
    else
        return null;
}
// merge each order in success orders with information of this correspond order
function mergeOrders(orderInfos, newOrders) {
    let mergedOrders = [];
    for (let newOrder of newOrders) {
        for (let orderInfo of orderInfos) {
            if (newOrder.symbol === orderInfo.symbol) {
                const mergedOrder = {
                    ...newOrder,
                    ...orderInfo,
                };
                mergedOrders.push(mergedOrder);
            }
        }
    }
    return mergedOrders;
}
