"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tickerPricesUpdateEvHandlerWs = void 0;
const logger_service_1 = __importDefault(require("../../services/logger.service"));
const binance_service_1 = require("../../services/binance.service");
const helper_1 = require("../helper");
////////////////////////////////////////////////////
// handle when ticker price update
const tickerPricesUpdateEvHandlerWs = (msg) => {
    try {
        // const isBotRunning = global.isBotActive;
        // console.log('isBotRunning',isBotRunning)
        // if (!isBotRunning) return;
        // // update tick count
        // global.tickCount += 1;
        // console.log('global.tickCount',global.tickCount)
        // if (global.tickCount % BOT_RUN_INTERVAL !== 0) return;
        // evaluate and place order if bot is active
        const msgString = msg.toString();
        const symbolTickerPrices = JSON.parse(msgString);
        const numOfSymbols = symbolTickerPrices.length;
        // call side-effect function
        evaluateAndPlaceOrderWs(symbolTickerPrices);
        // update positions
    }
    catch (err) {
        logger_service_1.default.saveError(err);
    }
};
exports.tickerPricesUpdateEvHandlerWs = tickerPricesUpdateEvHandlerWs;
/////////////////////////////////////////////////////////
// helper function to evaluate and place order
function evaluateAndPlaceOrderWs(symbolTickerPricesWs) {
    // const ableSymbols = symbolTickerPricesWs
    //   .filter(({ s }) => global.ableOrderSymbolsMap[s] === true)
    //   .map(({ s }) => s);
    // console.log("ableSymbolTickerPrices", ableSymbols);
    for (let symbolTickerPrice of symbolTickerPricesWs) {
        // -- Key is symbol property
        const symbol = symbolTickerPrice.s;
        // -- Check able to order or not
        if (!global.ableOrderSymbolsMap[symbol])
            continue;
        // -- Get PositionsMap
        const positionsMap = global.positionsMap;
        // -- Get OrderPiecesMap
        const orderPiecesMap = global.orderPiecesMap;
        // -- Get symbolPricesMapStart
        const symbolPricesStartMap = global.symbolPricesStartMap;
        // -- Calculate prevPrice
        let prevPrice = null;
        if (!orderPiecesMap[symbol]) {
            // initial pieces for this symbol
            orderPiecesMap[symbol] = [];
        }
        const orderPiecesOfSymbol = orderPiecesMap[symbol];
        const orderPiecesOfSymbolLen = orderPiecesOfSymbol.length;
        const isSymbolHasOrder = orderPiecesOfSymbolLen > 0;
        if (orderPiecesOfSymbol && isSymbolHasOrder) {
            const lastOrderPiece = orderPiecesOfSymbol[0];
            prevPrice = lastOrderPiece.price;
        }
        else {
            const symbolPriceStart = symbolPricesStartMap[symbol];
            prevPrice = symbolPriceStart?.price;
        }
        if (!prevPrice)
            continue;
        // -- Calculate currPrice
        const currPrice = symbolTickerPrice.c;
        // -- Calculate percentChange
        const prevPriceNumber = parseFloat(prevPrice);
        const currPriceNumber = parseFloat(currPrice);
        const percentChange = (currPriceNumber / prevPriceNumber - 1) * 100;
        // -- Define direction
        // Buy
        const percentToFirstBuy = openingChain.percent_to_first_buy;
        const percentToBuy = openingChain.percent_to_buy;
        const percentToBuyNumber = parseFloat(percentToBuy);
        const percentToFirstBuyNumber = parseFloat(percentToFirstBuy);
        const isPercentAbleToFirstBuy = percentChange > percentToFirstBuyNumber;
        const isPercentAbleToBuyMore = percentChange > percentToBuyNumber;
        const isAbleToFirstBuy = isPercentAbleToFirstBuy && !isSymbolHasOrder;
        const isAbleToBuyMore = isPercentAbleToBuyMore && isSymbolHasOrder;
        const isAbleToBuy = isAbleToFirstBuy || isAbleToBuyMore;
        // Sell
        const percentToSell = openingChain.percent_to_sell;
        const percentToSellNumber = parseFloat(percentToSell);
        const isPercentAbleToSell = percentChange < percentToSellNumber;
        const isAbleToSell = isPercentAbleToSell && orderPiecesOfSymbolLen >= 2;
        let debugMsg = `${symbol} prev: ${prevPrice}; curr: ${currPrice}; percent: ${percentChange}`;
        let direction = "";
        if (isAbleToBuy)
            direction = "BUY";
        if (isAbleToSell)
            direction = "SELL";
        if (direction === "")
            logger_service_1.default.saveDebugAndClg(debugMsg);
        if (direction === "")
            continue;
        // -- Define quantity
        const transactionSizeStart = openingChain.transaction_size_start;
        const orderQtyStart = transactionSizeStart / currPriceNumber;
        let orderQty = orderQtyStart;
        if (isAbleToBuy) {
            if (isAbleToBuyMore) {
                const symbolPosition = positionsMap[symbol];
                const positionAmt = symbolPosition?.positionAmt;
                const positionAmtNumber = parseFloat(positionAmt); // number (can be 0), or nan
                // for some precision reason make "has order" symbol have positionAmt =0
                if (!positionAmtNumber)
                    orderQty = orderQtyStart;
                if (positionAmtNumber)
                    orderQty = positionAmtNumber;
            }
            if (isAbleToFirstBuy) {
                orderQty = orderQtyStart;
            }
        }
        if (isAbleToSell) {
            const symbolPosition = positionsMap[symbol];
            const positionAmt = symbolPosition?.positionAmt;
            const positionAmtNumber = parseFloat(positionAmt); // number (can be 0), or nan (if parse from undefined/null)
            if (!positionAmtNumber)
                continue;
            if (positionAmtNumber)
                orderQty = positionAmtNumber / 2;
        }
        const precision = exchangeInfoSymbolsMap[symbol]?.quantityPrecision;
        const orderQtyValid = (0, helper_1.validateAmount)(orderQty, precision);
        debugMsg += ` positionAmt: ${positionsMap[symbol].positionAmt}`;
        logger_service_1.default.saveDebugAndClg(debugMsg);
        // -- Place order, get the id generated from uuidV4 for check order info purpose
        const clientOrderId = (0, binance_service_1.placeOrderWebsocket)(symbol, orderQtyValid, direction);
        // -- Save order info to memory
        // prepare
        const newOrderInfo = {
            symbol: symbol,
            amount: orderQtyValid * currPriceNumber, // is transaction size
            currPrice: currPriceNumber,
            prevPrice: prevPriceNumber,
            percentChange: percentChange,
            direction: direction,
            isFirstOrder: !isSymbolHasOrder,
            positionAmt: parseFloat(positionsMap[symbol]?.positionAmt),
            quantity: orderQtyValid,
            quantityPrecision: precision,
        };
        // add new key-val
        global.orderInfosMap[clientOrderId] = newOrderInfo;
    }
}
