"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
// Websocket Api General Info--------------------
// base endpoint:
// const baseWs = "wss://ws-fapi.binance.com/ws-fapi/v1"
// base endpoint for testnet:
// const baseWs = "wss://testnet.binancefuture.com/ws-fapi/v1"
// Websocket Market Streams-----------------------
// const baseWs = "wss://fstream.binance.com"; (ex: wss://fstream.binance.com/ws/bnbusdt@aggTrade)
const baseWs = "wss://fstream.binance.com";
// const baseWs = "wss://fstream.binancefuture.com";
const markPriceWs = () => {
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
// markPriceWs();
const allMarkPriceWs = () => {
    const wsURL = `${baseWs}/ws/!market@arr`; // default is 3s interval
    const ws = new ws_1.WebSocket(wsURL);
    ws.on("open", () => {
        console.log("WebSocket connection established.");
    });
    ws.on("message", (msg) => {
        //   console.log("Received message:", msg);
        const messageString = msg.toString(); // Convert buffer to string
        const messageJSON = JSON.parse(messageString); // Parse string as JSON
        for (let sym of messageJSON.slice(0, 2)) {
            console.log(sym.e, sym.P);
        }
        console.log("Received message:", messageJSON.slice(0, 2));
    });
    ws.on("error", (error) => {
        console.error("WebSocket error:", error);
    });
    ws.on("close", () => {
        console.log("WebSocket connection closed.");
    });
};
// allMarkPriceWs();
const allTickerPriceWs = () => {
    // const wsURL = `${baseWs}/ws/!markPrice@arr`; // default is 3s interval
    // const wsURL = `${baseWs}/ws/!ticker@arr`; // default is 3s interval
    // const wsURL = `${baseWs}/stream?streams=!ticker@arr/!market@arr`; // default is 3s interval
    const wsURL = `${baseWs}/stream?streams=!markPrice@arr/!ticker@arr`; // default is 3s interval
    const ws = new ws_1.WebSocket(wsURL);
    ws.on("open", () => {
        console.log("WebSocket connection established.");
    });
    ws.on("message", (msg) => {
        //   console.log("Received message:", msg);
        const messageString = msg.toString(); // Convert buffer to string
        const messageJSON = JSON.parse(messageString); // Parse string as JSON
        console.log("stream: ", messageJSON.stream, " total: ", messageJSON.data.length, "data overview:", messageJSON.data.slice(0, 2));
        // if (messageJSON.stream === "!markPrice@arr") {
        //   console.log(
        //     "stream: ",
        //     messageJSON.stream,
        //     " total: ",
        //     messageJSON.data.length,
        //     "data overview:",
        //     messageJSON.data.slice(0, 2)
        //   );
        // }
        // if (messageJSON.stream === "!ticker@arr") {
        //   console.log(
        //     "stream: ",
        //     messageJSON.stream,
        //     " total: ",
        //     messageJSON.data.length,
        //     "data overview:",
        //     messageJSON.data.slice(0, 2)
        //   );
        // }
        // for (let sym of messageJSON) {
        //   if (sym.s === "BTCUSDT") {
        //     if (sym.e === "24hrTicker") console.log("lastPrice: ", sym.c);
        //     if (sym.e === "markPriceUpdate") console.log("marketPrice: ", sym.p);
        //   }
        // }
        // console.log("Received message:", messageJSON.slice(0, 2));
    });
    ws.on("error", (error) => {
        console.error("WebSocket error:", error);
    });
    ws.on("close", () => {
        console.log("WebSocket connection closed.");
    });
};
allTickerPriceWs();
