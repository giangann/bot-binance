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
const helper_ultil_1 = require("../ultils/helper.ultil");
const binance_service_1 = __importDefault(require("./binance.service"));
const market_order_piece_service_1 = __importDefault(require("./market-order-piece.service"));
const moment_1 = __importDefault(require("moment"));
const coin_service_1 = __importDefault(require("./coin.service"));
const helper_ultil_2 = require("../ultils/helper.ultil");
var interval = null;
const active = (params, chainId) => __awaiter(void 0, void 0, void 0, function* () {
    interval = setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield tick(params, chainId);
        }
        catch (err) {
            console.log(err);
            return false;
        }
    }), 5000);
    return true;
});
function tick(params, chainId) {
    return __awaiter(this, void 0, void 0, function* () {
        let { symbol, transaction_size, transaction_increase, percent_to_buy, percent_to_sell, } = params;
        const directionRes = yield toDirection(symbol, percent_to_buy, percent_to_sell);
        const direction = directionRes === null || directionRes === void 0 ? void 0 : directionRes.direction;
        const percent_change = directionRes === null || directionRes === void 0 ? void 0 : directionRes.result;
        console.log("direction", direction);
        const isExecute = Boolean(direction);
        console.log("isExecute", isExecute);
        if (isExecute) {
            const currPrice = yield binance_service_1.default.getSymbolPriceNow(symbol);
            if (direction === "buy") {
                transaction_size += transaction_increase;
            }
            if (direction === "sell") {
                transaction_size -= transaction_increase / 2;
            }
            const order_amount = transaction_size / currPrice;
            const newMarketOrder = yield binance_service_1.default.createMarketOrder(symbol, direction, order_amount);
            const { id, symbol: order_symbol, price, amount } = newMarketOrder;
            console.log(id, order_symbol, price, amount);
            yield saveOrderPiece({
                id,
                market_order_chains_id: chainId,
                percent_change: percent_change.toString(),
                price: price.toString(),
                symbol,
                total_balance: (yield binance_service_1.default.getMyBalance()).total.toString(),
            });
            wsServerGlob.emit("new-order", direction, transaction_size, percent_change.toString(), price.toString(), symbol);
        }
        console.log("bot is running");
        // ws emit bot is running
        wsServerGlob.emit("bot-running", "bot is running");
    });
}
function saveOrderPiece(params) {
    return __awaiter(this, void 0, void 0, function* () {
        yield market_order_piece_service_1.default.create(params);
    });
}
function toDirection(symbol, percentToBuy, percentToSell) {
    return __awaiter(this, void 0, void 0, function* () {
        const percentChange = yield calculatePercentChange(symbol);
        console.log(percentChange, percentToBuy, percentToSell);
        if (percentChange > percentToBuy)
            return { direction: "buy", result: percentChange };
        if (percentChange < percentToSell)
            return { direction: "sell", result: percentChange };
        return null;
    });
}
function calculatePercentChange(symbol) {
    return __awaiter(this, void 0, void 0, function* () {
        const isHasOrderToday = yield todayHasOrder(symbol);
        const prevPrice = yield getPrevPrice(symbol, isHasOrderToday);
        const currPrice = yield binance_service_1.default.getSymbolPriceNow(symbol);
        const pricePercentChange = (0, helper_ultil_1.priceToPercent)(prevPrice, currPrice);
        return pricePercentChange;
    });
}
function getPrevPrice(symbol, todayHasOrder) {
    return __awaiter(this, void 0, void 0, function* () {
        let prevPrice = "";
        if (todayHasOrder) {
            const lastOrder = yield getLastOrder(symbol);
            prevPrice = lastOrder.price;
        }
        else {
            const coin = yield coin_service_1.default.detail({ symbol });
            prevPrice = coin.price;
        }
        console.log("symbol ", symbol, " prev price ", prevPrice);
        return parseFloat(prevPrice);
    });
}
function getLastOrder(symbol) {
    return __awaiter(this, void 0, void 0, function* () {
        let orders = yield market_order_piece_service_1.default.list({
            createdAt: (0, moment_1.default)().format("YYYY-MM-DD"),
            symbol: symbol,
        });
        let orderSortByDate = orders.sort((a, b) => (0, helper_ultil_2.compareDate)(a.createdAt, b.createdAt));
        return orderSortByDate[0];
    });
}
function todayHasOrder(symbol) {
    return __awaiter(this, void 0, void 0, function* () {
        let isSymbolHasOrderToday;
        let orders = yield market_order_piece_service_1.default.list({
            createdAt: (0, moment_1.default)().format("YYYY-MM-DD"),
            symbol: symbol,
        });
        if (orders.length !== 0)
            isSymbolHasOrderToday = true;
        return isSymbolHasOrderToday;
    });
}
// async function test() {
//   const newOrder = await binanceService.createMarketOrder(
//     "BTCUSDT",
//     "sell",
//     0.020282689991760156
//   );
//   console.log(newOrder)
// }
// test()
const quit = () => {
    clearInterval(interval);
    wsServerGlob.emit('bot-quit', 'bot was quited');
    //   ws emit quit bot
};
exports.default = {
    active,
    quit
};
