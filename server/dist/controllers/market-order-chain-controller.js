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
const binance_service_1 = __importDefault(require("../services/binance.service"));
const market_order_chain_service_1 = __importDefault(require("../services/market-order-chain.service"));
const market_order_piece_service_1 = __importDefault(require("../services/market-order-piece.service"));
const helper_ultil_1 = require("../ultils/helper.ultil");
const server_response_ultil_1 = require("../ultils/server-response.ultil");
const list = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const listChain = yield market_order_chain_service_1.default.list();
        server_response_ultil_1.ServerResponse.response(res, listChain);
    }
    catch (err) {
        server_response_ultil_1.ServerResponse.error(res, err.message);
    }
});
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // create new record of order chain in db
        let params = {
            amount: parseFloat(req.body.amount),
            side: req.body.side,
            symbol: req.body.symbol,
        };
        let intervalTime = parseInt(req.body.interval_time);
        let percentDiff = {
            down: parseFloat(req.body.percent_diff_down),
            up: parseFloat(req.body.percent_diff_up),
        };
        let amountMulti = parseInt(req.body.amount_multi);
        const totalBalanceNow = (yield binance_service_1.default.getMyBalance()).total.toString();
        const newChain = yield market_order_chain_service_1.default.create({
            status: "open",
            total_balance_start: totalBalanceNow,
        });
        let count = 0;
        const interval = setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
            // check can excute
            let prev_total = count
                ? (yield getLastOrder()).total_balance
                : newChain.total_balance_start;
            let percentChange = yield totalBalancePercentChange(prev_total);
            const isExecute = yield isContinue(prev_total, percentDiff.down);
            //
            if (isExecute) {
                try {
                    if (percentChange > percentDiff.up) {
                        params = Object.assign(Object.assign({}, params), { amount: params.amount * amountMulti }); //multi amount
                    }
                    // create binance order - call piece order
                    const newBinanceOrder = yield makeOrderAndNoti(params);
                    // save this piece order with correspond order chain
                    yield saveOrderPiece(newBinanceOrder.id, newChain.id, percentChange);
                    count += 1;
                }
                catch (err) {
                    console.log("err", err);
                    const total_balance_end = (yield getLastOrder()).total_balance;
                    const percent_change = parseFloat(total_balance_end) /
                        parseFloat(newChain.total_balance_start);
                    updateOrderChainStatus(newChain.id, "closed", total_balance_end, percent_change);
                    clearInterval(interval);
                }
            }
            else {
                const total_balance_end = (yield getLastOrder()).total_balance;
                const percent_change = parseFloat(total_balance_end) /
                    parseFloat(newChain.total_balance_start);
                updateOrderChainStatus(newChain.id, "closed", total_balance_end, percent_change);
                clearInterval(interval);
            }
        }), intervalTime * 1000);
        server_response_ultil_1.ServerResponse.response(res, newChain);
    }
    catch (err) {
        server_response_ultil_1.ServerResponse.error(res, err.message);
        console.log("chain controller err", err);
    }
});
function action(orderBinanceParams, orderPieceParams) {
    return __awaiter(this, void 0, void 0, function* () {
        // make binance order as orderPiece and save to db
        const newBinanceOrder = yield makeOrderAndNoti(orderBinanceParams);
        console.log(newBinanceOrder.id);
        // save order piece correspond with order chain
        const { orderChainId, percentChange } = orderPieceParams;
        const orderPiece = yield saveOrderPiece(newBinanceOrder.id, orderChainId, percentChange);
    });
}
function makeOrderAndNoti(params) {
    return __awaiter(this, void 0, void 0, function* () {
        //  make binance market order
        const { symbol, side, amount } = params;
        let newBinanceOrder = yield binance_service_1.default.createMarketOrder(symbol, side, amount);
        //  ws noti here ...
        return newBinanceOrder;
    });
}
function saveOrderPiece(id, market_order_chains_id, percent_change) {
    return __awaiter(this, void 0, void 0, function* () {
        let total_balance = (yield binance_service_1.default.getMyBalance()).total;
        // create new record of order piece to db
        let pieceParams = {
            id,
            market_order_chains_id,
            total_balance: total_balance.toString(),
            percent_change: percent_change.toString(),
        };
        const savedOrder = yield market_order_piece_service_1.default.create(pieceParams);
        return savedOrder;
    });
}
function updateOrderChainStatus(chainId, status, total_balance_end, percent_change) {
    return __awaiter(this, void 0, void 0, function* () {
        const updatedAt = (0, moment_1.default)(Date.now()).format("YYYY-MM-DD HH:mm:ss");
        const updatedOrderChain = yield market_order_chain_service_1.default.update({
            id: chainId,
            status: status,
            updatedAt,
            percent_change: percent_change.toString(),
            total_balance_end,
        });
        console.log("chain ", chainId, " closed");
        return updatedOrderChain;
    });
}
// calculate percent_change prev_total with curr_total
// percent_change >=down then return true, else is false
function isContinue(prev_total, down) {
    return __awaiter(this, void 0, void 0, function* () {
        const percent_change = yield totalBalancePercentChange(prev_total);
        if (percent_change >= down)
            return true;
        return false;
    });
}
function totalBalancePercentChange(prev_total) {
    return __awaiter(this, void 0, void 0, function* () {
        const curr_total = (yield binance_service_1.default.getMyBalance()).total;
        return (0, helper_ultil_1.priceToPercent)(typeof prev_total === "string" ? parseFloat(prev_total) : prev_total, curr_total);
    });
}
function getLastOrder() {
    return __awaiter(this, void 0, void 0, function* () {
        const listOrder = yield market_order_piece_service_1.default.list();
        const sortedListOrder = listOrder.sort((a, b) => (0, helper_ultil_1.compareDate)(a.createdAt, b.createdAt));
        return sortedListOrder[0];
    });
}
exports.default = { create, list };
