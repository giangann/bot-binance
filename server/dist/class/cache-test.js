"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BotCacheTest = void 0;
const constant_1 = require("../constants/constant");
const helper_1 = require("../helper");
const cache_1 = require("./cache");
class BotCacheTest extends cache_1.BotCache {
    intervalUpdate;
    mockPrices;
    mockPricesIndex;
    constructor(symbolStartPrices, symbolCUrrentPries, positions, exchangeInfoSymbols, openingChain, ableSymbols, datasetItems) {
        super(symbolStartPrices, symbolCUrrentPries, positions, exchangeInfoSymbols, openingChain, ableSymbols);
        this.mockPricesIndex = 0;
        this.mockPrices = (0, helper_1.datasetItemsToSymbolPrices)(datasetItems);
    }
    getMockPrices = (() => {
        const resetIndex = () => {
            this.mockPricesIndex = 0;
        };
        const getPrices = () => {
            const prices = this.mockPrices[this.mockPricesIndex];
            this.mockPricesIndex++;
            return prices;
        };
        return {
            getPrices,
            resetIndex,
        };
    })();
    updateSymbolPositionAmt(symbol, positionAmtAdd) {
        const symbolPosition = this.getSymbolPosition(symbol);
        if (!symbolPosition) {
            const newSymbolPosition = {
                ...constant_1.positionSample,
                symbol,
                positionAmt: positionAmtAdd.toString(),
                unRealizedProfit: "0",
            };
            this.positionsMap[symbol] = newSymbolPosition;
        }
        else {
            const { positionAmt } = symbolPosition;
            const positionAmtNumber = parseFloat(positionAmt);
            const newSymbolPositionAmtNumber = positionAmtNumber + positionAmtAdd;
            const newSymbolPositionAmt = newSymbolPositionAmtNumber.toString();
            this.positionsMap[symbol] = {
                ...symbolPosition,
                positionAmt: newSymbolPositionAmt,
            };
        }
    }
    startSelfUpdateCache() {
        this.intervalUpdate = setInterval(() => this.tickUpdateCache(), 1000);
    }
    tickUpdateCache() {
        this.getAndUpdateSymbolCurrentPricesMap();
        this.updatedSymbolPositionsMapUnrlPnl();
    }
    getAndUpdateSymbolCurrentPricesMap() {
        const mockPrice = this.getMockPrices.getPrices();
        this.updateSymbolCurrentPricesMap(mockPrice ?? []);
    }
    updatedSymbolPositionsMapUnrlPnl() {
        // get all positions symbol
        const positionsMap = this.positionsMap;
        const positionSymbols = Object.keys(positionsMap);
        for (let symbol of positionSymbols) {
            const symbolPosition = this.getSymbolPosition(symbol);
            const currentSymbolPnl = this.calculatePositionPnl(symbol);
            this.positionsMap[symbol] = {
                ...symbolPosition,
                unRealizedProfit: currentSymbolPnl.toString(),
            };
        }
    }
    /**
     * stopSelfUpdateCache
     */
    stopSelfUpdateCache() {
        this.getMockPrices.resetIndex();
        clearInterval(this?.intervalUpdate ?? undefined);
    }
    /**
     * getUpdateInterval
     */
    getIntervalUpdate() {
        return this.intervalUpdate;
    }
    isIndexOutsidePricesArray() {
        return this.mockPricesIndex > this.mockPrices.length;
    }
}
exports.BotCacheTest = BotCacheTest;
