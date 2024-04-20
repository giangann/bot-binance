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
exports.createInterval = void 0;
const moment_1 = __importDefault(require("moment"));
const binance_service_1 = __importDefault(require("../services/binance.service"));
const coin_service_1 = __importDefault(require("../services/coin.service"));
const market_order_chain_service_1 = __importDefault(require("../services/market-order-chain.service"));
const market_order_piece_service_1 = __importDefault(require("../services/market-order-piece.service"));
const get_price_of_symbols_1 = require("./get-price-of-symbols");
const createInterval = () => {
    const interval = setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        console.log("start tick");
        // fetch now symbols price
        const symbols = yield coin_service_1.default.getAllSymbolsDB();
        const prices = yield binance_service_1.default.getSymbolsClosePrice(symbols);
        global.symbolsPriceMap = (0, get_price_of_symbols_1.arrayToMap)(prices);
        global.wsServerGlob.emit("symbols-price", prices);
        // calculate total
        const { total_balance_usdt, totalUSDT, coins } = yield calCulateBalance();
        global.wsServerGlob.emit("ws-balance", total_balance_usdt, totalUSDT, coins);
        // make order
        const chainOpen = yield getChainOpen();
        if (chainOpen) {
            const { orderParams, orderPieceParams } = yield genOrderParams();
            console.log("found ", orderParams.length, " coin need to order is", orderParams);
            const binanceOrdersCreated = yield makeOrders(orderParams);
            console.log("binance order arr", binanceOrdersCreated);
            const errOrders = binanceOrdersCreated.filter((order) => order === null);
            let newOrderPieceParams = [];
            for (let createdOrder of binanceOrdersCreated) {
                if (createdOrder && createdOrder) {
                    for (let orderPieceParam of orderPieceParams) {
                        let createdSymbol = ((_a = createdOrder.info) === null || _a === void 0 ? void 0 : _a.symbol) || createdOrder.symbol;
                        let hasBackSlash = createdSymbol.includes("/");
                        if (hasBackSlash) {
                            createdSymbol = createdSymbol.split("/").join("");
                        }
                        if (createdSymbol === orderPieceParam.symbol) {
                            newOrderPieceParams.push(Object.assign(Object.assign({}, orderPieceParam), { id: createdOrder.id }));
                        }
                    }
                }
            }
            // save order pieces
            console.log("newOrderPieceParams", newOrderPieceParams);
            const newOrderPieces = yield saveOrderPieces(newOrderPieceParams);
            global.wsServerGlob.emit("new-orders", newOrderPieces.length);
        }
        console.log("emit and end tick");
    }), 10000);
    global.tickInterval = interval;
};
exports.createInterval = createInterval;
function calCulateBalance() {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const balances = yield binance_service_1.default.fetchMyBalance();
        const balancesTotalObj = balances.total;
        const currCoins = Object.keys(balancesTotalObj);
        let totalUSDT = balancesTotalObj["USDT"];
        let totalBalancesUSDT = totalUSDT; // init with usdt amount
        console.log("init balance", totalBalancesUSDT);
        let coinsBalances = [];
        // loop to calculate totalBalances to Usdt
        for (let coinName of currCoins) {
            let coinSymbolUSDT = coinName + "USDT";
            let symbolPrice = (_a = global.symbolsPriceMap[coinSymbolUSDT]) === null || _a === void 0 ? void 0 : _a.price;
            if (symbolPrice) {
                let coinAmount = balancesTotalObj[coinName];
                let coinTotal = coinAmount * symbolPrice;
                let coinObj = {
                    coin: coinName,
                    amount: coinAmount,
                    price: symbolPrice,
                    total: coinTotal,
                };
                totalBalancesUSDT += coinTotal;
                coinsBalances.push(coinObj);
            }
        }
        // log info to console
        let consoleMsg = `Total: ${currCoins.length} in balance, calculated: ${coinsBalances.length}, can't calculated: ${currCoins.length - coinsBalances.length}`;
        console.log(consoleMsg);
        // save to global
        global.totalBalancesUSDT = totalBalancesUSDT;
        return {
            totalUSDT,
            total_balance_usdt: totalBalancesUSDT,
            coins: coinsBalances,
        };
    });
}
function makeOrders(orderParams) {
    return __awaiter(this, void 0, void 0, function* () {
        const promises = orderParams.map((param) => __awaiter(this, void 0, void 0, function* () {
            const { symbol, amount, direction } = param;
            try {
                return yield binance_service_1.default.createMarketOrder(symbol, direction, amount);
            }
            catch (error) {
                let errorMsg = `Error creating order for ${symbol}: ${error.message}`;
                console.error(errorMsg);
                global.wsServerGlob.emit('order-err', errorMsg);
                // Return a placeholder value or handle the error as needed
                return null; // or throw error; depending on your error handling strategy
            }
        }));
        return Promise.all(promises);
    });
}
function saveOrderPieces(orderPieceParams) {
    return __awaiter(this, void 0, void 0, function* () {
        return Promise.all(orderPieceParams.map((param) => __awaiter(this, void 0, void 0, function* () {
            return yield market_order_piece_service_1.default.create(param);
        })));
    });
}
function genOrderParams() {
    return __awaiter(this, void 0, void 0, function* () {
        // to get able symbols, each symbols should be calculate percent price change
        const symbols = Object.keys(global.symbolsPriceMap);
        // get today orderPieces map
        const orderPiecesMap = yield toDayOrderPiecesMap();
        // get coin 1 am prices map
        const coin1AmPricesMap = yield coin1AmSymbolPricesMap();
        // init order params
        let orderParams = [];
        let orderPieceParams = [];
        // get chain is open
        const openChain = yield getChainOpen();
        const { percent_to_buy, percent_to_sell, transaction_size_start } = openChain;
        const percentToBuy = parseFloat(percent_to_buy);
        const percentToSell = parseFloat(percent_to_sell);
        for (let symbolKey of symbols) {
            let transaction_size = transaction_size_start;
            let percentChange = 0;
            let currPrice = global.symbolsPriceMap[symbolKey].price;
            let isTodayHasOrder;
            // already have order today
            if (symbolKey in orderPiecesMap) {
                let prevPrice = parseFloat(orderPiecesMap[symbolKey].price);
                percentChange = (currPrice / prevPrice - 1) * 100;
                isTodayHasOrder = true;
            }
            // first order of day
            else {
                let prevPrice = parseFloat(coin1AmPricesMap[symbolKey].price);
                percentChange = (currPrice / prevPrice - 1) * 100;
                isTodayHasOrder = false;
            }
            let direction = null;
            if (percentChange >= percentToBuy)
                direction = "buy";
            if (percentChange <= percentToSell)
                direction = "sell";
            if (percentChange < percentToSell && percentChange > percentToBuy)
                direction = null;
            // define transaction_size
            if (isTodayHasOrder) {
                let base = direction === "buy" ? 2 : 0.5;
                transaction_size =
                    parseFloat(orderPiecesMap[symbolKey].transaction_size) * base;
            }
            else {
                transaction_size =
                    direction === "buy"
                        ? transaction_size_start
                        : transaction_size_start / 2;
            }
            // define param
            if (direction) {
                let orderParam = {
                    amount: transaction_size / currPrice,
                    direction,
                    symbol: symbolKey,
                };
                orderParams.push(orderParam);
                let orderPieceParam = {
                    direction,
                    market_order_chains_id: openChain.id,
                    percent_change: percentChange.toString(),
                    price: currPrice.toString(),
                    symbol: symbolKey,
                    total_balance: "0.0000",
                    amount: (transaction_size / currPrice).toString(),
                    transaction_size: transaction_size.toString(),
                };
                orderPieceParams.push(orderPieceParam);
            }
        }
        return { orderParams, orderPieceParams };
    });
}
function coin1AmSymbolPricesMap() {
    return __awaiter(this, void 0, void 0, function* () {
        const coin1AmPrices = yield coin_service_1.default.list();
        let res = {};
        for (let piece of coin1AmPrices) {
            let key = piece.symbol;
            if (!(key in res)) {
                res[key] = piece;
            }
        }
        return res;
    });
}
function toDayOrderPiecesMap() {
    return __awaiter(this, void 0, void 0, function* () {
        const orderPieces = yield market_order_piece_service_1.default.list({
            createdAt: (0, moment_1.default)().format("YYYY-MM-DD"),
        });
        const orderPiecesMap = createOrderPiecesMap(orderPieces);
        return orderPiecesMap;
    });
}
function createOrderPiecesMap(orderPieces) {
    let res = {};
    for (let piece of orderPieces) {
        let key = piece.symbol;
        if (!(key in res)) {
            res[key] = piece;
        }
    }
    return res;
}
function getChainOpen() {
    return __awaiter(this, void 0, void 0, function* () {
        const openChain = yield market_order_chain_service_1.default.list({ status: "open" });
        if (openChain.length)
            return openChain[0];
        else
            return null;
    });
}
