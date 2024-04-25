"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
// Websocket Api General Info--------------------
// base endpoint:
// const baseWs = wss://ws-fapi.binance.com/ws-fapi/v1
// base endpoint for testnet:
// const baseWs = wss://testnet.binancefuture.com/ws-fapi/v1
// Websocket Market Streams-----------------------
// const baseWs = "wss://fstream.binance.com"; (ex: wss://fstream.binance.com/ws/bnbusdt@aggTrade)
const baseWs = "wss://fstream.binance.com";
const connectWs = () => {
    const wsURL = `${baseWs}/ws/btcusdt@markPrice`;
    const ws = new ws_1.WebSocket(wsURL);
    ws.on("open", () => {
        console.log("WebSocket connection established.");
    });
    ws.on("message", (msg) => {
        //   console.log("Received message:", msg);
        const messageString = msg.toString(); // Convert buffer to string
        const messageJSON = JSON.parse(messageString); // Parse string as JSON
        console.log("Received message:", messageJSON);
    });
    ws.on("error", (error) => {
        console.error("WebSocket error:", error);
    });
    ws.on("close", () => {
        console.log("WebSocket connection closed.");
    });
};
connectWs();
