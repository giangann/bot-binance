"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
const market_order_chain_service_1 = __importDefault(require("./market-order-chain.service"));
const binance_service_1 = __importDefault(require("./binance.service"));
const helper_ultil_1 = require("../ultils/helper.ultil");
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
async function createOrder(chainId, ...args) {
    const positions = await binance_service_1.default.getPositions();
    const positionsMap = (0, helper_ultil_1.positionsToMap)(positions);
    const positionAmtOfSymbol = parseFloat(positionsMap[args[0]]?.positionAmt);
    const newOrderResponse = await binance_service_1.default.createMarketOrder(...args);
    let newDebugLog = "";
    if (newOrderResponse.success === true) {
        const newOrder = newOrderResponse.data;
        const { orderId, symbol, origQty, side } = newOrder;
        newDebugLog = `create new order: ${orderId} ${side} ${origQty} ${symbol}`;
        if (side === "SELL")
            newDebugLog += ` before order has ${positionAmtOfSymbol} ${symbol}`;
    }
    else {
        const response = newOrderResponse;
        const { code, msg } = response.error;
        newDebugLog = `error when create new order: ${code} - ${msg}`;
    }
    console.log(newDebugLog);
    logger_config_1.logger.debug(newDebugLog);
}
const quit = async () => {
    await updateOrderChain();
    //   ws emit quit bot
    global.wsServerGlob.emit("bot-quit", "bot was quited");
};
exports.default = {
    quit,
    createOrder
};
