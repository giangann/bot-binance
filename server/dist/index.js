"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_connect_1 = require("./loaders/db-connect");
const http_server_1 = __importDefault(require("./loaders/http-server"));
const market_data_stream_1 = require("./loaders/market-data-stream");
const websocket_server_1 = require("./loaders/websocket-server");
const logger_service_1 = __importDefault(require("./services/logger.service"));
// construct http server
const start = async () => {
    try {
        await (0, db_connect_1.connectDatabase)();
        const httpServer = (0, http_server_1.default)();
        const wsInstance = (0, websocket_server_1.createWebSocketServerInstance)(httpServer);
        global.wsServerInstance = wsInstance;
        (0, market_data_stream_1.subcribeAndForwardBinanceStream)();
    }
    catch (error) {
        logger_service_1.default.saveError(error);
    }
};
start();
