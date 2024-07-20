"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNeedRemove = exports.handleOrderError = exports.updateOrderPieces = exports.newOrderPlaceEvHandlerWs = void 0;
const moment_1 = __importDefault(require("moment"));
const logger_service_1 = __importDefault(require("../../services/logger.service"));
////////////////////////////////////////////////////
// handle when new order placed
const newOrderPlaceEvHandlerWs = (msg) => {
    try {
        //-- Parse message
        const orderPlaceResponse = JSON.parse(msg.toString());
        //-- Check parsedMsg is success or error
        const resultKey = "result";
        const errorKey = "error";
        if (resultKey in orderPlaceResponse) {
            const generatedID = orderPlaceResponse.id;
            const orderPlaceResult = orderPlaceResponse[resultKey];
            // update order pieces store in memory
            (0, exports.updateOrderPieces)(generatedID, orderPlaceResult);
            // update positions in memory
            // updatePositionsWebsocket();
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
        console.error("Error in newOrderPlaceEvHandlerWs:", err); // Debugging log
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
    // log
    logger_service_1.default.saveDebugAndClg(`${newOrder.side} ${newOrder.origQty} ${symbol} with prevPrice: ${orderInfo.prevPrice}, currPrice: ${orderInfo.currPrice}, percentChange: ${orderInfo.percentChange}, positionAmt: ${orderInfo.positionAmt} `);
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
};
exports.updateOrderPieces = updateOrderPieces;
/////////////////////////////////////////////////////////
// handle error order
function handleOrderError(uuid, error) {
    // Find order information in memory:
    const orderInfo = global.orderInfosMap[uuid];
    const { symbol, quantity, direction } = orderInfo;
    const { code, msg } = error;
    logger_service_1.default.saveDebugAndClg(`ERROR: ${direction} ${quantity} ${symbol} // ${code} ${msg}`);
    // Update able order symbol map
    if (isNeedRemove(code)) {
        global.ableOrderSymbolsMap[symbol] = false;
    }
    else {
        // other handler
    }
}
exports.handleOrderError = handleOrderError;
function isNeedRemove(errorCode) {
    const errorCodeNotAccept = [-4131, -4003, -2019, -2020];
    if (errorCodeNotAccept.includes(errorCode))
        return true;
    return false;
}
exports.isNeedRemove = isNeedRemove;
