"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subcribeAndForwardBinanceStream = void 0;
const ws_1 = require("ws");
const helper_1 = require("../ultils/helper");
const futurePriceStream = () => {
    const baseWs = "wss://fstream.binance.com";
    const wsURL = `${baseWs}/stream?streams=!markPrice@arr/!ticker@arr`; // default is 3s interval
    const ws = new ws_1.WebSocket(wsURL);
    ws.on("open", () => {
        console.log("WebSocket Binance Future Market Data Stream connection established, ready to forward push message");
    });
    ws.on("message", (msg) => {
        const messageString = msg.toString(); // Convert buffer to string
        const messageJSON = JSON.parse(messageString); // Parse string as JSON
        // prepare emit
        const emitMsg = (0, helper_1.binanceStreamToSymbolPrice)(messageJSON);
        global.wsServerInstance.emit("future-binance-stream-forward", emitMsg);
    });
    ws.on("error", (error) => {
        console.error("WebSocket error:", error);
    });
    ws.on("close", () => {
        console.log("WebSocket connection closed.");
    });
};
const testnetPriceStream = () => {
    try {
        const baseWs = "wss://fstream.binancefuture.com";
        const wsURL = `${baseWs}/stream?streams=!markPrice@arr/!ticker@arr`; // default is 3s interval
        const ws = new ws_1.WebSocket(wsURL);
        ws.on("open", () => {
            console.log("WebSocket Binance Future <Testnet> Market Data Stream connection established, ready to forward push message");
        });
        ws.on("message", (msg) => {
            try {
            }
            catch (err) {
                console.log("err", err, " with msg: ", err.message);
                throw err;
            }
            const messageString = msg.toString(); // Convert buffer to string
            const messageJSON = JSON.parse(messageString); // Parse string as JSON
            // prepare emit
            const emitMsg = (0, helper_1.binanceStreamToSymbolPrice)(messageJSON);
            global.wsServerInstance.emit("testnet-binance-stream-forward", emitMsg);
        });
        ws.on("error", (error) => {
            console.error("WebSocket error:", error);
        });
        ws.on("close", () => {
            console.log("WebSocket connection closed.");
        });
    }
    catch (err) {
        throw err;
    }
};
const subcribeAndForwardBinanceStream = () => {
    testnetPriceStream();
    futurePriceStream();
};
exports.subcribeAndForwardBinanceStream = subcribeAndForwardBinanceStream;
