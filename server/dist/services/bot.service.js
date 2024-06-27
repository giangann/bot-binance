"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
const market_order_chain_service_1 = __importDefault(require("./market-order-chain.service"));
const binance_service_1 = __importDefault(require("./binance.service"));
const logger_config_1 = require("../loaders/logger.config");
async function getChainOpen() {
    const listOpenOrder = await market_order_chain_service_1.default.list({ status: "open" });
    return listOpenOrder[0];
}
async function updateOrderChain() {
    try {
        const chainIsOpen = await getChainOpen();
        const updatedRes = await market_order_chain_service_1.default.update({
            id: chainIsOpen.id,
            total_balance_end: "0.000",
            percent_change: "0.000", // can't defined
            price_end: "0.000",
            status: "closed",
            updatedAt: (0, moment_1.default)().format("YYYY-MM-DD HH:mm:ss"),
        });
        return updatedRes;
    }
    catch (err) {
        console.log("err updateOrderChain", err);
    }
}
// return a promise {symbol, id, }
const quit = async () => {
    await updateOrderChain();
    //   ws emit quit bot
    global.wsServerGlob.emit("bot-quit", "bot was quited");
};
const closeAllPositions = async () => {
    const positions = await binance_service_1.default.getPositions();
    // make promises and fullfilled
    const orderPromises = positions.map((position) => {
        let symbol = position.symbol;
        let quantity = parseFloat(position.positionAmt);
        let side = "SELL";
        return binance_service_1.default.createMarketOrder(symbol, side, quantity);
    });
    const orderResult = await Promise.all(orderPromises);
    // log and error
    let numOfSuccess = 0;
    let numOfFailure = 0;
    for (let res of orderResult) {
        if (res.success === true) {
            const { orderId, side, origQty, symbol } = res.data;
            numOfSuccess += 1;
            // log order info
            const msg = `orderId: ${orderId}, symbol: ${symbol}, quantity: ${origQty}, side: ${side}`;
            logger_config_1.logger.info(msg);
        }
        else {
            numOfFailure += 1;
            // log error message
            const { error: { code, msg }, payload, } = res;
            const { symbol, quantity, side } = payload;
            const logMsg = `${code} - ${msg}, symbol: ${symbol}, quantity: ${quantity}, side: ${side}`;
            logger_config_1.logger.info(logMsg);
        }
    }
};
exports.default = {
    quit,
    closeAllPositions,
};
