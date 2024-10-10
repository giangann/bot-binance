"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BotCache = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const ws_1 = __importDefault(require("ws"));
const helper_1 = require("../helper");
const helper_2 = require("../ultils/helper");
dotenv_1.default.config();
class BotCache {
    symbolCurrentPricesMap;
    symbolStartPricesMap;
    positionsMap;
    openingChain;
    orderPiecesMap;
    orderInfosMap;
    ableSymbols;
    symbolPnlManagingsMap;
    wsConnMarketDataStream;
    exchangeInfoSymbolsMap;
    // define orderPieces and botConfig (orderChain)
    constructor(symbolStartPrices, symbolCurrentPrices, positions, exchangeInfoSymbols, openingChain, ableSymbols) {
        this.symbolStartPricesMap = (0, helper_1.symbolPricesToMap)([...symbolStartPrices]);
        this.symbolCurrentPricesMap = (0, helper_1.symbolPricesToMap)([...symbolCurrentPrices]);
        this.positionsMap = (0, helper_1.positionsToMap)(positions);
        this.openingChain = openingChain;
        this.orderPiecesMap = {};
        this.orderInfosMap = {};
        this.ableSymbols = ableSymbols;
        this.symbolPnlManagingsMap = (0, helper_2.symbolPnlManagingsMapFromAbleSymbols)(ableSymbols, {
            is_max_pnl_start_reached: false,
            max_pnl_start: openingChain.symbol_max_pnl_start,
        });
        this.exchangeInfoSymbolsMap = (0, helper_1.exchangeInfoSymbolsToMap)(exchangeInfoSymbols);
        this.wsConnMarketDataStream = new ws_1.default(`${process.env.BINANCE_BASE_WS_MARK_URL}/stream?streams=!markPrice@arr/!ticker@arr`);
    }
    getSymbolStartPricesMap() {
        return this.symbolStartPricesMap;
    }
    getSymbolCurrentPricesMap() {
        return this.symbolCurrentPricesMap;
    }
    getSymbolStartPrice(symbol) {
        const symbolStartPrice = this.symbolStartPricesMap[symbol];
        if (!symbolStartPrice)
            throw new Error(`Error: Start_Price of ${symbol} not found !`);
        return symbolStartPrice;
    }
    getSymbolPrevPrice(symbol) {
        const symbolOrders = this.getOrdersOfSymbol(symbol);
        if (symbolOrders === null)
            return null;
        if (symbolOrders.length <= 0)
            return null;
        const lastestOrder = symbolOrders[0];
        if (!lastestOrder)
            return null;
        return lastestOrder.price;
    }
    getSymbolCurrentPrice(symbol) {
        const symbolCurrentPrice = this.symbolCurrentPricesMap[symbol];
        return symbolCurrentPrice;
    }
    updateSymbolCurrentPricesMap(symbolPrices) {
        for (let symbolPrice of symbolPrices) {
            const symbol = symbolPrice.symbol;
            this.symbolCurrentPricesMap[symbol] = symbolPrice;
        }
    }
    updateSymbolCurrentTickerPrice(symbol, newTickerPrice) {
        if (!this.symbolCurrentPricesMap[symbol])
            return;
        this.symbolCurrentPricesMap[symbol].tickerPrice = newTickerPrice;
    }
    updateSymbolCurrentMarketPrice(symbol, newMarketPrice) {
        if (!this.symbolCurrentPricesMap[symbol])
            return;
        this.symbolCurrentPricesMap[symbol].marketPrice = newMarketPrice;
    }
    getSymbolPosition(symbol) {
        const symbolPosition = this.positionsMap[symbol] ?? null;
        return symbolPosition;
    }
    isSymbolPositionAmtZero(symbol) {
        const symbolPosition = this.getSymbolPosition(symbol);
        const symbolPositionAmt = symbolPosition?.positionAmt;
        const symbolPositionAmtNumber = parseFloat(symbolPositionAmt) || 0; // (1)0 or (2)number>0
        return symbolPositionAmtNumber === 0;
    }
    updatePositionsMap(positions) {
        for (let position of positions) {
            const symbol = position.symbol;
            this.positionsMap[symbol] = position;
        }
    }
    removeAbleSymbol(symbol) {
        (0, helper_2.removeArrayElMutate)(this.ableSymbols, symbol);
    }
    getSymbolPnlManaging(symbol) {
        return this.symbolPnlManagingsMap[symbol] ?? null;
    }
    updateSymbolPnlManaging(symbol, key, value) {
        const symbolPnlManaging = this.getSymbolPnlManaging(symbol);
        if (symbolPnlManaging) {
            this.symbolPnlManagingsMap[symbol] = {
                ...symbolPnlManaging,
                [key]: value,
            };
        }
    }
    /**
     * getBotConfig
     * Query to database to get one opening order chain
     */
    getBotConfig() {
        const openingChain = this.openingChain;
        if (!openingChain)
            throw new Error(`Bot config not found`);
        return openingChain;
    }
    updateBotConfig(key, value) {
        (0, helper_2.updateObject)(this.openingChain, key, value);
    }
    getOrdersOfSymbol(symbol) {
        const orders = this.orderPiecesMap[symbol] ?? null;
        return orders;
    }
    updateOrderPiecesOfSymbol(symbol, order) {
        const symbolOrders = this.getOrdersOfSymbol(symbol);
        if (!symbolOrders) {
            // is first order
            this.orderPiecesMap[symbol] = [order];
        }
        else {
            // not is first order
            this.orderPiecesMap[symbol] = [order, ...symbolOrders];
        }
    }
    getOrderInfo(id) {
        return this.orderInfosMap[id] ?? null;
    }
    updateOrderInfoMap(orderInfo) {
        const id = orderInfo.arbitraryId;
        this.orderInfosMap[id] = orderInfo;
    }
    getAbleSymbols() {
        return this.ableSymbols;
    }
    getExchangeInfoSymbolsMap() {
        return this.exchangeInfoSymbolsMap;
    }
    // about Profit and Loss calculate
    calculatePositionPnl(symbol) {
        const symbolOrders = this.getOrdersOfSymbol(symbol);
        if (!symbolOrders)
            return 0;
        const symbolPosition = this.getSymbolPosition(symbol);
        if (!symbolPosition)
            return 0;
        const currentQty = parseFloat(symbolPosition.positionAmt);
        if (currentQty === 0)
            return 0;
        if (symbolOrders && symbolPosition) {
            let totalPurchased = 0;
            let tempQty = 0;
            // loop from first order to latest order
            const symbolOrdersCopyReverse = symbolOrders.slice().reverse(); // make a reverse copy array without modify it
            for (let order of symbolOrdersCopyReverse) {
                const { side, quantity } = order;
                const orderQtyNumber = quantity;
                if (side === "BUY") {
                    totalPurchased += parseFloat(order.price) * quantity;
                    tempQty += orderQtyNumber;
                }
                if (side === "SELL") {
                    tempQty -= orderQtyNumber;
                }
                if (tempQty === 0)
                    totalPurchased = 0;
            }
            // FORMULAR: unrealizePnl = (currPrice - avgPrice) * currentQty
            //           avgPrice = totalPurchase / totalQuantity
            const currentPrice = this.getSymbolCurrentPrice(symbol);
            const currentMarketPrice = currentPrice.marketPrice;
            const currentMarketPriceNumber = parseFloat(currentMarketPrice);
            const avgPurchasedPrice = totalPurchased / currentQty;
            const unrealizedPnl = (currentMarketPriceNumber - avgPurchasedPrice) * currentQty;
            return unrealizedPnl;
        }
        return 0;
    }
    calculateTotalPnl() {
        const positionsMap = this.positionsMap;
        const positionSymbols = Object.keys(positionsMap);
        let totalPnl = 0;
        for (let symbol of positionSymbols) {
            totalPnl += this.calculatePositionPnl(symbol);
        }
        return totalPnl;
    }
    // auto update cache by ws-connection-event
    startSelfUpdateCache() {
        this.wsConnMarketDataStream.on("message", (msg) => {
            this.tickUpdateCache(msg);
        });
    }
    tickUpdateCache(msg) {
        const msgString = msg.toString();
        const streamMsgParsed = JSON.parse(msgString);
        if (streamMsgParsed.stream === "!markPrice@arr") {
            const symbolMarketPricesWs = streamMsgParsed.data;
            for (const symbolPrice of symbolMarketPricesWs) {
                const symbol = symbolPrice.s;
                const newMarketPrice = symbolPrice.p;
                this.updateSymbolCurrentMarketPrice(symbol, newMarketPrice);
            }
        }
        if (streamMsgParsed.stream === "!ticker@arr") {
            const symbolTickerPricesWs = streamMsgParsed.data;
            for (const symbolPrice of symbolTickerPricesWs) {
                const symbol = symbolPrice.s;
                const newTickerPrice = symbolPrice.c;
                this.updateSymbolCurrentTickerPrice(symbol, newTickerPrice);
            }
        }
    }
    stopSelfUpdateCache() {
        this.wsConnMarketDataStream.close();
    }
}
exports.BotCache = BotCache;
