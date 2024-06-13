"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadApp = void 0;
const create_interval_1 = require("./create-interval");
const db_connect_1 = require("./db-connect");
const http_server_1 = require("./http-server");
const logger_config_1 = require("./logger.config");
const subcribe_binance_stream_1 = require("./subcribe-binance-stream");
const ws_server_1 = require("./ws-server");
const loadApp = async () => {
    try {
        const httpServer = (0, http_server_1.createHttpServer)();
        const wsServer = (0, ws_server_1.createWebSocket)(httpServer);
        global.wsServerGlob = wsServer;
        (0, subcribe_binance_stream_1.subcribeAndForwardBinanceStream)();
        // cronJobSchedule();
        await (0, db_connect_1.connectDatabase)();
        (0, create_interval_1.createInterval)();
        return {
            httpServer,
            wsServer,
        };
    }
    catch (err) {
        logger_config_1.logger.info(`The connection to database was failed with error: ${err}`);
    }
};
exports.loadApp = loadApp;
