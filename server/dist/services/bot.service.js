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
const quit = () => __awaiter(void 0, void 0, void 0, function* () {
    yield updateOrderChain();
    //   ws emit quit bot
    wsServerGlob.emit("bot-quit", "bot was quited");
});
exports.default = {
    quit,
};
