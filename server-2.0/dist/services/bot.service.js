"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
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
    const waitTime = parseInt(process.env.WAIT_POSITION) || 1;
    await (0, helper_1.fakeDelay)(waitTime);
    if (global.isRunTick === false) {
        global.isRunTick = true;
        return;
    }
    logger_service_1.default.saveDebugAndClg(`tick able run: ${global.isRunTick}`); // check
    // -- Quit if pnl thres hold reach
    const totalPositionPnl = (0, helper_1.totalPnlFromPositionsMap)(global.positionsMap);
    const pnlToStop = global.openingChain?.pnl_to_stop;
    const pnlToStopNumber = parseFloat(pnlToStop);
    // calculate neccesary stats
    if (totalPositionPnl >= global.MAX_PNL)
        global.isMaxPnlReached = true; // pnl reach top
    const profitToQuit = global.MAX_PNL * global.MAX_PNL_THRESHOLD_TO_QUIT;
    const isTotalPnlUnderThreshold = totalPositionPnl <= profitToQuit;
    // decide able to quit or not
    const isAbleToMakeProfit = global.isMaxPnlReached && isTotalPnlUnderThreshold;
    const isAbleToCutLoss = totalPositionPnl <= pnlToStopNumber;
    const isAbleToQuit = isAbleToCutLoss || isAbleToMakeProfit;
    if (isAbleToQuit) {
        const stopMessage = `Reason: PNL = ${totalPositionPnl} <= ${pnlToStopNumber}`;
        await market_order_chain_service_1.default.update({
            id: global.openingChain?.id,
            stop_reason: stopMessage,
        });
        await quit();
        logger_service_1.default.saveDebug(stopMessage);
        global.wsServerInstance.emit("bot-quit", stopMessage);
    }
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
        const isHasTwoBuyOrderBefore = orderPiecesOfSymbol[0]?.direction === "BUY" &&
            orderPiecesOfSymbol[1]?.direction === "BUY";
        const isAbleToSell = isPercentAbleToSell && isHasTwoBuyOrderBefore;
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
                orderQty = positionAmtNumber;
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
    // -- store data from memory to database (order pieces)
    //    check data in databaase
    const orderPiecesMem = global.orderPieces;
    const openingChainDetail = await market_order_chain_service_1.default.detail(id);
    const piecesOfOpeningChain = openingChainDetail.order_pieces;
    if (piecesOfOpeningChain.length < orderPiecesMem.length) {
        const piecesMap = (0, helper_1.orderPiecesToMap)(piecesOfOpeningChain);
        const piecesToSave = orderPieces.filter(({ id: orderId }) => !(orderId in piecesMap));
        await market_order_piece_service_1.default.createMany(piecesToSave);
    }
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
    // clear variable for testing
    global.isMaxPnlReached = false;
    // logger
    logger_service_1.default.saveDebug("Bot quited");
    return true;
};
exports.default = { active, quit };
