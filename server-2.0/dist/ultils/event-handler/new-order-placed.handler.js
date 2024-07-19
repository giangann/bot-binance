"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNeedRemove = exports.handleOrderError = exports.updateOrderPieces = exports.newOrderPlaceEvHandlerWs = void 0;
const moment_1 = __importDefault(require("moment"));
const binance_service_1 = require("../../services/binance.service");
const helper_1 = require("../helper");
const logger_service_1 = __importDefault(require("../../services/logger.service"));
////////////////////////////////////////////////////
// handle when new order placed
const newOrderPlaceEvHandlerWs = (msg) => {
    try {
        //-- Parse message
        const orderPlaceResponse = JSON.parse(msg.toString());
        //////////////////////////////////////////// --Log for debug //////////////////////////////////////////
        const { id, status, error, result, rateLimits } = orderPlaceResponse;
        let debugMsg = '';
        if (error) {
            debugMsg = `ID: ${id}, STATUS: ${status}, ERROR: ${(0, helper_1.errorWsApiResponseToString)(error)}, RATE_LIMITS: ${(0, helper_1.rateLimitsArrayToString)(rateLimits)}`;
        }
        if (result) {
            const { symbol, origQty, side } = result;
            debugMsg = `ID: ${id}, STATUS: ${status}, RESULT: ${side} ${origQty} ${symbol}, RATE_LIMITS: ${(0, helper_1.rateLimitsArrayToString)(rateLimits)}`;
        }
        console.log(debugMsg);
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //-- Check parsedMsg is success or error
        const resultKey = "result";
        const errorKey = "error";
        if (resultKey in orderPlaceResponse) {
            const generatedID = orderPlaceResponse.id;
            const orderPlaceResult = orderPlaceResponse[resultKey];
            // update order pieces store in memory
            (0, exports.updateOrderPieces)(generatedID, orderPlaceResult);
            // update positions in memory
            (0, binance_service_1.updatePositionsWebsocket)();
        }
        if (errorKey in orderPlaceResponse) {
            // updateErrorLog()
            const generatedID = orderPlaceResponse.id;
            const orderError = orderPlaceResponse[errorKey];
            handleOrderError(generatedID, orderError);
        }
    }
    catch (err) {
        logger_service_1.default.saveError(err);
    }
};
exports.newOrderPlaceEvHandlerWs = newOrderPlaceEvHandlerWs;
/////////////////////////////////////////////////////////
// update memory data
const updateOrderPieces = (uuid, newOrder) => {
    const symbol = newOrder.symbol;
    const orderPiecesMap = global.orderPiecesMap;
    const openingChain = global.openingChain;
    // Find order information in memory:
    const orderInfo = global.orderInfosMap[uuid];
    console.log("global.orderInfosMap length:", Object.keys(global.orderInfosMap).length);
    // process data from newOrder
    const newOrderPieces = {
        id: newOrder.orderId.toString(),
        symbol: symbol,
        direction: newOrder.side,
        quantity: newOrder.origQty,
        transaction_size: orderInfo.amount.toString(),
        price: orderInfo.currPrice.toString(),
        percent_change: orderInfo.percentChange.toString(),
        market_order_chains_id: openingChain.id,
        order_chain: openingChain,
        createdAt: (0, moment_1.default)().format("YYYY-MM-DD HH:mm:ss"),
        updatedAt: (0, moment_1.default)().format("YYYY-MM-DD HH:mm:ss"),
        timestamp: newOrder.updateTime.toString(),
        total_balance: "0.00", // undefined
    };
    // update memory data: unshift newOrder to array (add to head)
    if (symbol in orderPiecesMap) {
        global.orderPiecesMap[symbol].unshift(newOrderPieces);
    }
    else {
        global.orderPiecesMap[symbol] = [newOrderPieces];
    }
    // push newOrderpieces to array
    global.orderPieces.push(newOrderPieces);
    // emit to client
    global.wsServerInstance.emit('new-order-placed', newOrderPieces);
    console.log('global.orderPiecesMap length: ', Object.keys(global.orderPiecesMap).length);
    console.log('global.orderPieces length: ', global.orderPieces.length);
};
exports.updateOrderPieces = updateOrderPieces;
/////////////////////////////////////////////////////////
// handle error order
function handleOrderError(uuid, error) {
    // Find order information in memory:
    const orderInfo = global.orderInfosMap[uuid];
    const { symbol, quantity } = orderInfo;
    const { code, msg } = error;
    // Update able order symbol map
    if (isNeedRemove(code)) {
        global.ableOrderSymbolsMap[symbol] = false;
        console.log(`Error order symbol removed, ${symbol} with errorCode: ${error}`);
    }
    else {
        // other handler
        console.log(`Unknown error: ${symbol} ${quantity} ${code} - ${msg}`);
    }
    console.log(`Able symbols: ${Object.entries(global.ableOrderSymbolsMap).filter(([_symbol, able]) => able).length}`);
}
exports.handleOrderError = handleOrderError;
function isNeedRemove(errorCode) {
    const errorCodeNotAccept = [-4131, -2019, -2020];
    if (errorCodeNotAccept.includes(errorCode))
        return true;
    return false;
}
exports.isNeedRemove = isNeedRemove;
