"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subcribeAndForwardBinanceStream = void 0;
const ws_1 = require("ws");
const helper_ultil_1 = require("../ultils/helper.ultil");
const futurePriceStream = () => {
    const baseWs = "wss://fstream.binance.com";
    const wsURL = `${baseWs}/stream?streams=!markPrice@arr/!ticker@arr`; // default is 3s interval
    const ws = new ws_1.WebSocket(wsURL);
    ws.on("open", () => {
        console.log("WebSocket connection established.");
    });
    ws.on("message", (msg) => {
        const messageString = msg.toString(); // Convert buffer to string
        const messageJSON = JSON.parse(messageString); // Parse string as JSON
        // prepare emit
        const emitMsg = (0, helper_ultil_1.binanceStreamToSymbolPrice)(messageJSON);
        global.wsServerGlob.emit("future-binance-stream-forward", emitMsg);
    });
    ws.on("error", (error) => {
        console.error("WebSocket error:", error);
    });
    ws.on("close", () => {
        console.log("WebSocket connection closed.");
    });
};
const testnetPriceStream = () => {
    const baseWs = "wss://fstream.binancefuture.com";
    const wsURL = `${baseWs}/stream?streams=!markPrice@arr/!ticker@arr`; // default is 3s interval
    const ws = new ws_1.WebSocket(wsURL);
    ws.on("open", () => {
        console.log("WebSocket connection established.");
    });
    ws.on("message", (msg) => {
        console.log("received new msg in testnet");
        const messageString = msg.toString(); // Convert buffer to string
        const messageJSON = JSON.parse(messageString); // Parse string as JSON
        // prepare emit
        const emitMsg = (0, helper_ultil_1.binanceStreamToSymbolPrice)(messageJSON);
        global.wsServerGlob.emit("testnet-binance-stream-forward", emitMsg);
    });
    ws.on("error", (error) => {
        console.error("WebSocket error:", error);
    });
    ws.on("close", () => {
        console.log("WebSocket connection closed.");
    });
};
const subcribeAndForwardBinanceStream = () => {
    testnetPriceStream();
    futurePriceStream();
};
exports.subcribeAndForwardBinanceStream = subcribeAndForwardBinanceStream;
