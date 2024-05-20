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
const moment_1 = __importDefault(require("moment"));
const market_order_chain_service_1 = __importDefault(require("./market-order-chain.service"));
const binance_service_1 = __importDefault(require("./binance.service"));
const helper_ultil_1 = require("../ultils/helper.ultil");
const logger_config_1 = require("../loaders/logger.config");
function getChainOpen() {
    return __awaiter(this, void 0, void 0, function* () {
        const listOpenOrder = yield market_order_chain_service_1.default.list({ status: "open" });
        return listOpenOrder[0];
    });
}
function updateOrderChain() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const chainIsOpen = yield getChainOpen();
            const updatedRes = yield market_order_chain_service_1.default.update({
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
    });
}
// return a promise {symbol, id, }
function createOrder(chainId, ...args) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const positions = yield binance_service_1.default.getPositions();
        const positionsMap = (0, helper_ultil_1.positionsToMap)(positions);
        const positionAmtOfSymbol = parseFloat((_a = positionsMap[args[0]]) === null || _a === void 0 ? void 0 : _a.positionAmt);
        const newOrderResponse = yield binance_service_1.default.createMarketOrder(...args);
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
    });
}
const quit = () => __awaiter(void 0, void 0, void 0, function* () {
    yield updateOrderChain();
    //   ws emit quit bot
    global.wsServerGlob.emit("bot-quit", "bot was quited");
});
exports.default = {
    quit,
    createOrder
};
