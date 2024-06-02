"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
const market_order_chain_service_1 = __importDefault(require("./market-order-chain.service"));
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
exports.default = {
    quit,
};
