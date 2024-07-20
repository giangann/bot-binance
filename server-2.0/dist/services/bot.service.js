"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// // @ts-nocheck
const dotenv_1 = __importDefault(require("dotenv"));
const helper_1 = require("../ultils/helper");
const binance_service_1 = require("./binance.service");
const logger_service_1 = __importDefault(require("./logger.service"));
const market_order_chain_service_1 = __importDefault(require("./market-order-chain.service"));
const market_order_piece_service_1 = __importDefault(require("./market-order-piece.service"));
dotenv_1.default.config();
const active = async () => {
    const time = parseInt(process.env.BOT_RUN_INTERVAL) || 6; // second
    global.botInterval = setInterval(tick, time * 1000);
};
const tick = async () => {
    global.isRunTick = false;
    (0, binance_service_1.updatePositionsWebsocket)();
    await (0, helper_1.fakeDelay)(1);
    if (global.isRunTick === false) {
        global.isRunTick = true;
        return;
    }
    console.log("after fake delay"); // check
    // calculate and place order
    const ableSymbols = (0, helper_1.ableOrderSymbolsMapToArray)(global.ableOrderSymbolsMap);
    evaluateAndPlaceOrderWs(ableSymbols);
};
const evaluateAndPlaceOrderWs = (symbols) => {
    for (const symbol of symbols) {
        // -- Get PositionsMap
        const positionsMap = global.positionsMap;
        // -- Get OrderPiecesMap
        const orderPiecesMap = global.orderPiecesMap;
        // -- Get symbolPricesMapStart
        const symbolPricesStartMap = global.symbolPricesStartMap;
        // -- Get symbolPricesMapNow
        const symbolTickerPricesNowMap = global.symbolTickerPricesNowMap;
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
        const symbolTickerPriceNow = symbolTickerPricesNowMap[symbol];
        const currPrice = symbolTickerPriceNow?.price;
        if (!currPrice)
            continue;
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
};
const quit = async () => {
    // update bot status
    global.isBotActive = false;
    // update chain information database
    const openingChain = global.openingChain;
    const { id } = openingChain;
    await market_order_chain_service_1.default.update({ id, status: "closed" });
    // store data from memory to database (order pieces)
    const orderPieces = global.orderPieces;
    const promiseArr = orderPieces.map((piece) => {
        return market_order_piece_service_1.default.create(piece);
    });
    const orderPiecesCreatedResponse = await Promise.all(promiseArr);
    // close positions
    // get positions
    const positionsMap = global.positionsMap;
    const symbols = Object.keys(positionsMap);
    for (let symbol of symbols) {
        const position = positionsMap[symbol];
        const positionAmt = position?.positionAmt;
        const positionAmtNumber = parseFloat(positionAmt);
        if (!positionAmtNumber || positionAmtNumber === 0)
            continue;
        const direction = "SELL";
        // dont need to validate by precision because when place order its already valid
        const qty = positionAmtNumber;
        // place sell order
        (0, binance_service_1.closePositionWebSocket)(symbol, qty, direction);
    }
    // clean up memory (remove uneccessary data)
    global.orderPieces = [];
    global.orderPiecesMap = {};
    global.orderInfosMap = {};
    global.ableOrderSymbolsMap = {};
    global.openingChain = null;
    global.symbolPricesStartMap = null;
    global.exchangeInfoSymbolsMap = null;
    global.positionsMap = null;
    clearInterval(global.botInterval);
    // logger
    logger_service_1.default.saveDebug("Bot quited");
    return orderPiecesCreatedResponse;
};
exports.default = { active, quit };
