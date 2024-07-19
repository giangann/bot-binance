"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listenSymbolTickerPricesStreamWs = void 0;
const logger_service_1 = __importDefault(require("../services/logger.service"));
const ticker_prices_update_handler_1 = require("../ultils/event-handler/ticker-prices-update.handler");
const ws_1 = require("ws");
const listenSymbolTickerPricesStreamWs = () => {
    const baseWs = "wss://fstream.binance.com";
    const wsURL = `${baseWs}/ws/!ticker@arr`; // default is 1s interval
    const ws = new ws_1.WebSocket(wsURL);
    ws.on("open", () => {
        logger_service_1.default.saveDebugAndClg("WebSocket Binance Market Data Stream (!ticker@arr) connection established, ready to place order each update");
    });
    ws.on("message", ticker_prices_update_handler_1.tickerPricesUpdateEvHandlerWs);
    ws.on("error", (error) => {
        logger_service_1.default.saveError(error);
        console.error("WebSocket error:", error);
    });
    ws.on("close", () => {
        logger_service_1.default.saveDebugAndClg("WebSocket connection closed.");
    });
};
exports.listenSymbolTickerPricesStreamWs = listenSymbolTickerPricesStreamWs;
