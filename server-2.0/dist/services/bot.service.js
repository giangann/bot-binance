"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const helper_1 = require("../ultils/helper");
const binance_service_1 = require("./binance.service");
const logger_service_1 = __importDefault(require("./logger.service"));
const market_order_chain_service_1 = __importDefault(require("./market-order-chain.service"));
const market_order_piece_service_1 = __importDefault(require("./market-order-piece.service"));
const active = async () => {
    // get opening chain
    const openingChain = global.openingChain;
    const symbolPricesStartMap = global.symbolPricesStartMap;
    const exchangeInfoSymbolsMap = global.exchangeInfoSymbolsMap;
    // Make first tick or orders
    for (let symbolTickerPrice of global.symbolTickerPricesNow) {
        const symbol = symbolTickerPrice.symbol;
        // get price start
        const symbolPriceStart = symbolPricesStartMap[symbol];
        const priceStart = symbolPriceStart?.price;
        if (!priceStart)
            continue;
        // get price now
        const priceNow = symbolTickerPrice.price;
        if (!priceNow)
            continue;
        // percent change
        const priceStartNumber = parseFloat(priceStart);
        const priceNowNumber = parseFloat(priceNow);
        const percentChange = (priceNowNumber / priceStartNumber - 1) * 100;
        // decide to first buy or not
        const percentToFirstBuy = openingChain.percent_to_first_buy;
        const percentToFirstBuyNumber = parseFloat(percentToFirstBuy);
        if (percentChange > percentToFirstBuyNumber) {
            // calculate quantity
            const transactionSizeNumber = openingChain.transaction_size_start;
            const buyQty = transactionSizeNumber / priceNowNumber;
            const precision = exchangeInfoSymbolsMap[symbol]?.quantityPrecision;
            const buyQtyValid = (0, helper_1.validateAmount)(buyQty, precision);
            const direction = "BUY";
            // prepare
            const newOrderInfo = {
                symbol: symbol,
                amount: buyQtyValid * priceNowNumber, // is transaction size
                currPrice: priceNowNumber,
                prevPrice: priceStartNumber,
                percentChange: percentChange,
                direction: direction,
                isFirstOrder: true,
                positionAmt: 0,
                quantity: buyQtyValid,
                quantityPrecision: precision,
            };
            // -- Place order, get the id generated from uuidV4 for check order info purpose
            const cb = (uuid) => {
                // add new key-val
                global.orderInfosMap[uuid] = newOrderInfo;
            };
            (0, binance_service_1.placeOrderWebsocket)(symbol, buyQtyValid, direction, cb);
        }
    }
    // Update status of Bot as active after a timeout
    setTimeout(() => {
        global.isBotActive = true;
        // logger
        logger_service_1.default.saveDebug("Bot actived");
    }, 3000);
    // global.isBotActive = true;
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
    global.tickCount = 0;
    global.openingChain = null;
    global.symbolPricesStartMap = null;
    global.exchangeInfoSymbolsMap = null;
    global.positionsMap = null;
    // logger
    logger_service_1.default.saveDebug("Bot quited");
    return orderPiecesCreatedResponse;
};
exports.default = { active, quit };
