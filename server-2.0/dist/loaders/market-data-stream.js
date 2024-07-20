"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.subcribeAndForwardBinanceStream = void 0;
const ws_1 = require("ws");
const helper_1 = require("../ultils/helper");
const logger_service_1 = __importDefault(require("../services/logger.service"));
const futurePriceStream = () => {
    const baseWs = "wss://fstream.binance.com";
    const wsURL = `${baseWs}/stream?streams=!markPrice@arr/!ticker@arr`; // default is 3s interval
    const ws = new ws_1.WebSocket(wsURL);
    ws.on("open", () => {
        logger_service_1.default.saveDebugAndClg("WebSocket Binance Future Market Data Stream connection established, ready to forward push message");
    });
    ws.on("message", (msg) => {
        try {
            const messageString = msg.toString(); // Convert buffer to string
            const messageJSON = JSON.parse(messageString); // Parse string as JSON
            // prepare emit
            const emitMsg = (0, helper_1.binanceStreamToSymbolPrice)(messageJSON);
            global.wsServerInstance.emit("future-binance-stream-forward", emitMsg);
        }
        catch (err) {
            logger_service_1.default.saveError(err);
        }
    });
    ws.on("error", (error) => {
        logger_service_1.default.saveError(error);
        console.error("WebSocket error:", error);
    });
    ws.on("close", () => {
        logger_service_1.default.saveDebugAndClg("WebSocket Binance Future Market Data Stream connection closed.");
    });
};
const testnetPriceStream = () => {
    try {
        const baseWs = "wss://fstream.binancefuture.com";
        const wsURL = `${baseWs}/stream?streams=!markPrice@arr/!ticker@arr`; // default is 3s interval
        const ws = new ws_1.WebSocket(wsURL);
        ws.on("open", () => {
            logger_service_1.default.saveDebugAndClg("WebSocket Binance Future <Testnet> Market Data Stream connection established, ready to forward push message");
        });
        ws.on("message", (msg) => {
            try {
                const messageString = msg.toString(); // Convert buffer to string
                const messageJSON = JSON.parse(messageString); // Parse string as JSON
                // prepare emit
                const emitMsg = (0, helper_1.binanceStreamToSymbolPrice)(messageJSON);
                global.wsServerInstance.emit("testnet-binance-stream-forward", emitMsg);
            }
            catch (err) {
                logger_service_1.default.saveError(err);
            }
        });
        ws.on("error", (error) => {
            logger_service_1.default.saveError(error);
            console.error("WebSocket error:", error);
        });
        ws.on("close", () => {
            logger_service_1.default.saveDebugAndClg("WebSocket Binance Future <Testnet> Market Data Stream connection closed.");
        });
    }
    catch (err) {
        logger_service_1.default.saveError(err);
    }
};
const subcribeAndForwardBinanceStream = () => {
    testnetPriceStream();
    futurePriceStream();
};
exports.subcribeAndForwardBinanceStream = subcribeAndForwardBinanceStream;
