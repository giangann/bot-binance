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
const db_connect_1 = require("../loaders/db-connect");
const binance_service_1 = __importDefault(require("./binance.service"));
const coin_service_1 = __importDefault(require("./coin.service"));
const log_service_1 = __importDefault(require("./log.service"));
const helper_ultil_1 = require("../ultils/helper.ultil");
const market_order_chain_service_1 = __importDefault(require("./market-order-chain.service"));
const market_order_piece_service_1 = __importDefault(require("./market-order-piece.service"));
const coinService = new coin_service_1.default(true);
const test = () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, db_connect_1.connectDatabase)();
    console.log("start");
    const startTime = Date.now();
    const accInfo = yield binance_service_1.default.getAccountInfo();
    const positions = yield binance_service_1.default.getPositions();
    const positionsMap = (0, helper_ultil_1.positionsToMap)(positions);
    const symbolPriceTickers = yield binance_service_1.default.getSymbolPriceTickers();
    const symbolPriceTickersMap = (0, helper_ultil_1.symbolPriceTickersToMap)(symbolPriceTickers);
    const exchangeInfo = yield binance_service_1.default.getExchangeInfo();
    const exchangeInfoSymbolsMap = (0, helper_ultil_1.exchangeInfoSymbolsToMap)(exchangeInfo.symbols);
    const openChain = (yield market_order_chain_service_1.default.list({ status: "open" }))[0];
    const orderPiecesMap = (0, helper_ultil_1.orderPiecesToMap)(openChain.order_pieces);
    const symbolPriceTickers1Am = yield binance_service_1.default.getSymbolPriceTickers1Am();
    const symbolPriceTickers1AmMap = (0, helper_ultil_1.symbolPriceTickersToMap)(symbolPriceTickers1Am);
    const orderParams = genMarketOrderParams(symbolPriceTickersMap, symbolPriceTickers1AmMap, positionsMap, orderPiecesMap, openChain, exchangeInfoSymbolsMap);
    const ordersResponse = yield makeManyOrder();
    const piecesResponse = yield saveOrderPieces();
    const logResponse = yield saveLogs();
    console.log("able params:", orderParams.length, "order response:", ordersResponse.length, "pieces response: ", piecesResponse.length, "log response: ", logResponse.length);
    console.log("done, time = ", Date.now() - startTime, "ms");
});
// test();
// save 50 pieces inside chain_id=46
function saveOrderPieces() {
    return __awaiter(this, void 0, void 0, function* () {
        let piecesParams = [];
        for (let i = 1; i <= 50; i++) {
            let piece = {
                market_order_chains_id: 46,
                symbol: "COIN_A",
                amount: "0",
                direction: "SELL",
                id: i.toString(),
                percent_change: "0",
                price: "0",
                total_balance: "0",
                transaction_size: "0",
            };
            piecesParams.push(piece);
        }
        const createPiecePromises = piecesParams.map((param) => {
            return market_order_piece_service_1.default.create(param);
        });
        const response = yield Promise.all(createPiecePromises);
        return response;
    });
}
// save 300 logs for chain_id=46
function saveLogs() {
    return __awaiter(this, void 0, void 0, function* () {
        let logParams = [];
        for (let i = 0; i <= 300; i++) {
            let log = {
                market_order_chains_id: 46,
                message: "test",
                type: "test",
            };
            logParams.push(log);
        }
        const logPromises = logParams.map((log) => {
            return log_service_1.default.create(log);
        });
        const response = yield Promise.all(logPromises);
        return response;
    });
}
function genManyOrderParams() {
    let orderParams = [];
    for (let i = 1; i <= 50; i++) {
        let side = i % 2 === 0 ? "SELL" : "BUY";
        let orderParam = {
            symbol: "BTCUSDT",
            quantity: 0.005,
            side: side,
        };
        orderParams.push(orderParam);
    }
    return orderParams;
}
function makeManyOrder() {
    return __awaiter(this, void 0, void 0, function* () {
        const orderParams = genManyOrderParams();
        const orderPromises = orderParams.map((order) => {
            let { symbol, quantity, side } = order;
            return binance_service_1.default.createMarketOrder(symbol, side, quantity);
        });
        const response = yield Promise.all(orderPromises);
        return response;
    });
}
function genMarketOrderParams(symbolPriceTickersMap, symbolPriceTickers1AmMap, positionsMap, orderPiecesMap, openChain, exchangeInfoSymbolsMap) {
    var _a, _b, _c;
    try {
        const { percent_to_first_buy, percent_to_buy, percent_to_sell, transaction_size_start, } = openChain;
        let orderParams = [];
        // loop through symbolPriceTickers
        const symbols = Object.keys(symbolPriceTickersMap);
        for (let symbol of symbols) {
            // get prev price and current price
            let prevPrice = parseFloat((_a = symbolPriceTickers1AmMap[symbol]) === null || _a === void 0 ? void 0 : _a.price);
            let todayLatestOrder = orderPiecesMap[symbol];
            const hasOrderToday = Boolean(todayLatestOrder);
            if (todayLatestOrder) {
                prevPrice = parseFloat(todayLatestOrder.price);
            }
            let currPrice = parseFloat((_b = symbolPriceTickersMap[symbol]) === null || _b === void 0 ? void 0 : _b.price);
            // check if need to skip, continue to next symbol
            if (!prevPrice || !currPrice) {
                continue;
            }
            // calculate percentChange
            const percent_change = (currPrice / prevPrice - 1) * 100;
            // get position
            let position = positionsMap[symbol]; // positions just have symbol that positionAmt > 0
            let positionAmt = parseFloat(position === null || position === void 0 ? void 0 : position.positionAmt);
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
            const quantityPrecision = (_c = exchangeInfoSymbolsMap[symbol]) === null || _c === void 0 ? void 0 : _c.quantityPrecision;
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
