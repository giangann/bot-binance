"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const data_prepare_bot_1 = __importDefault(require("./loaders/data-prepare-bot"));
const db_connect_1 = require("./loaders/db-connect");
const http_server_1 = __importDefault(require("./loaders/http-server"));
const websocket_client_1 = require("./loaders/websocket-client");
const ws_messages_1 = require("./mock/ws-messages");
const logger_service_1 = __importDefault(require("./services/logger.service"));
const market_order_chain_service_1 = __importDefault(require("./services/market-order-chain.service"));
const ticker_prices_update_handler_1 = require("./ultils/event-handler/ticker-prices-update.handler");
const start = async () => {
    try {
        await (0, db_connect_1.connectDatabase)();
        (0, http_server_1.default)();
        await (0, data_prepare_bot_1.default)();
        // 
        global.orderPlaceWsConnection = (0, websocket_client_1.createWebSocketConnectionPlaceOrder)();
        global.updatePositionsWsConnection = (0, websocket_client_1.createWebSocketConnectionGetAndUpdatePositions)();
        global.closePositionsWsConnection = (0, websocket_client_1.createWebSocketConnectionClosePositions)();
        // create new chain ////////////////////////////////////////////////////////////////
        let params = {
            transaction_size_start: 10,
            percent_to_first_buy: '4',
            percent_to_buy: '5',
            percent_to_sell: '-2.5',
            pnl_to_stop: '0.0', // not related
        };
        const newOrderChain = await market_order_chain_service_1.default.create({
            status: "open",
            price_start: "0.000", // can't defined
            total_balance_start: "0.000", // can't defined
            ...params,
        });
        // update global data
        global.openingChain = newOrderChain;
        ////////////////////////////////////////////////////////////////////////////////////////////////
        const symbolTickerPricesNow = global.symbolTickerPricesNow;
        // generate message
        const listMessagesWs = (0, ws_messages_1.createListMessages)(symbolTickerPricesNow);
        // initial count variable
        let count = 0;
        const intervalTime = 3000; //ms
        // creat interval (3s)
        const interval = setInterval(() => {
            // 0. get message (listMessageWs[count])
            const message = Buffer.from(JSON.stringify(listMessagesWs[count]));
            // 1. call handle update with message
            (0, ticker_prices_update_handler_1.tickerPricesUpdateEvHandlerWs)(message);
            // 2. update count+=1
            count = count + 1;
            // 3. condition when count = listMessageLength then clearInterval
            if (count >= listMessagesWs.length) {
                logger_service_1.default.saveDebugAndClg('stop interval');
                clearInterval(interval);
            }
            ;
        }, intervalTime);
    }
    catch (err) {
        logger_service_1.default.saveError(err);
        console.log(err);
    }
};
start();
