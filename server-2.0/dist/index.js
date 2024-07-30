"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auto_active_bot_1 = require("./loaders/auto-active-bot");
const db_connect_1 = require("./loaders/db-connect");
const http_server_1 = __importDefault(require("./loaders/http-server"));
const market_data_stream_1 = require("./loaders/market-data-stream");
const ticker_prices_update_1 = require("./loaders/ticker-prices-update");
const websocket_client_1 = require("./loaders/websocket-client");
const websocket_server_1 = require("./loaders/websocket-server");
const start = async () => {
    try {
        await (0, db_connect_1.connectDatabase)();
        const httpServer = (0, http_server_1.default)();
        const wsServer = (0, websocket_server_1.createWebSocketServerInstance)(httpServer);
        global.wsServerInstance = wsServer;
        global.orderPlaceWsConnection = (0, websocket_client_1.createWebSocketConnectionPlaceOrder)();
        global.updatePositionsWsConnection = (0, websocket_client_1.createWebSocketConnectionGetAndUpdatePositions)();
        global.closePositionsWsConnection = (0, websocket_client_1.createWebSocketConnectionClosePositions)();
        (0, market_data_stream_1.subcribeAndForwardBinanceStream)();
        (0, ticker_prices_update_1.listenSymbolTickerPricesStreamWs)();
        (0, auto_active_bot_1.autoActiveStart)();
    }
    catch (err) {
        console.log(err);
    }
};
start();
