"use strict";
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
    const interval = setInterval(async () => {
        console.log("start tick");
        try {
            // fetch binance account info and emit to client
            const accInfo = await binance_service_1.default.getAccountInfo();
            global.wsServerGlob.emit("ws-account-info", accInfo);
            // fetch position info and emit to client
            const positions = await binance_service_1.default.getPositions();
            global.wsServerGlob.emit("ws-position", positions);
            // fetch symbolPriceTickers now
            const symbolPriceTickers = await binance_service_1.default.getSymbolPriceTickers();
            const symbolPriceTickersMap = (0, helper_ultil_1.symbolPriceTickersToMap)(symbolPriceTickers);
            global.wsServerGlob.emit("symbols-price", symbolPriceTickers);
            // fetch exchange info
            const exchangeInfo = await binance_service_1.default.getExchangeInfo();
            const exchangeInfoSymbolsMap = (0, helper_ultil_1.exchangeInfoSymbolsToMap)(exchangeInfo.symbols);
            // fetch chain open
            const openChain = await getChainOpen();
            if (openChain) {
                // fetch symbolPriceTickers 1AM from DB
                const symbolPriceTickers1Am = await binance_service_1.default.getSymbolPriceTickers1Am();
                const symbolPriceTickers1AmMap = (0, helper_ultil_1.symbolPriceTickersToMap)(symbolPriceTickers1Am);
                // // fetch list position
                const positionsMap = (0, helper_ultil_1.positionsToMap)(positions);
                // orderPieces of current order chain
                const orderPiecesMap = (0, helper_ultil_1.orderPiecesToMap)(openChain.order_pieces);
                // gen order params
                const orderParams = genMarketOrderParams(symbolPriceTickersMap, symbolPriceTickers1AmMap, positionsMap, orderPiecesMap, openChain, exchangeInfoSymbolsMap);
                const createdOrders = await makeOrders(orderParams);
                const successOrders = (0, helper_ultil_1.filterSuccessOrder)(createdOrders);
                const failureOrders = (0, helper_ultil_1.filterFailOrder)(createdOrders);
                const successOrdersData = successOrders.map((order) => order.data);
                // save log database
                const logParmas = genLogParams(failureOrders, openChain.id);
                await saveLogs(logParmas);
                const orderPieceParams = genOrderPieceParams(successOrdersData, orderParams, openChain.id);
                await saveOrderPieces(orderPieceParams);
                // save success order to debug log
                // saveOrderDebugLog(successOrdersData, orderParams, openChain.id);
                global.wsServerGlob.emit("bot-tick", orderParams.length, successOrders.length, failureOrders.length);
            }
        }
        catch (err) {
            const appErr = { name: err.name, message: err.message };
            global.wsServerGlob.emit("app-err", JSON.stringify(appErr));
            logger_config_1.logger.error(err.message);
        }
        console.log("emit and end tick");
    }, 10000);
    global.tickInterval = interval;
};
exports.createInterval = createInterval;
function genMarketOrderParams(symbolPriceTickersMap, symbolPriceTickers1AmMap, positionsMap, orderPiecesMap, openChain, exchangeInfoSymbolsMap) {
    try {
        const { percent_to_first_buy, percent_to_buy, percent_to_sell, transaction_size_start, } = openChain;
        let orderParams = [];
        // loop through symbolPriceTickers
        const symbols = Object.keys(symbolPriceTickersMap);
        for (let symbol of symbols) {
            // get prev price and current price
            let prevPrice = parseFloat(symbolPriceTickers1AmMap[symbol]?.price);
            let todayLatestOrder = orderPiecesMap[symbol];
            const hasOrderToday = Boolean(todayLatestOrder);
            if (todayLatestOrder) {
                prevPrice = parseFloat(todayLatestOrder.price);
            }
            let currPrice = parseFloat(symbolPriceTickersMap[symbol]?.price);
            // check if need to skip, continue to next symbol
            if (!prevPrice || !currPrice) {
                continue;
            }
            // calculate percentChange
            const percent_change = (currPrice / prevPrice - 1) * 100;
            // get position
            let position = positionsMap[symbol]; // positions just have symbol that positionAmt > 0
            let positionAmt = parseFloat(position?.positionAmt);
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
            const quantityPrecision = exchangeInfoSymbolsMap[symbol]?.quantityPrecision;
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
async function makeOrders(orderParams) {
    const promises = orderParams.map((param) => {
        const { symbol, amount, direction } = param;
        return binance_service_1.default.createMarketOrder(symbol, direction, amount);
    });
    return Promise.all(promises);
}
function genOrderPieceParams(newOrders, orderParams, chainId) {
    let orderPieceParams = [];
    for (let newOrder of newOrders) {
        for (let orderParam of orderParams) {
            if (newOrder?.symbol === orderParam.symbol) {
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
// if order with same symbol, get only 1 latest order
async function getChainOpen() {
    const openChain = await market_order_chain_service_1.default.list({ status: "open" });
    if (openChain.length)
        return openChain[0];
    else
        return null;
}
