import { TSymbolPriceTickerWs } from "../types/symbol-price-ticker";
import { TSymbolMarkPriceWs } from "../types/symbol-mark-price";
import { WebSocket } from "ws";
// Websocket Api General Info--------------------
// base endpoint:
// const baseWs = "wss://ws-fapi.binance.com/ws-fapi/v1"
// base endpoint for testnet:
// const baseWs = "wss://testnet.binancefuture.com/ws-fapi/v1"
// Websocket Market Streams-----------------------
// const baseWs = "wss://fstream.binance.com"; (ex: wss://fstream.binance.com/ws/bnbusdt@aggTrade)
// const baseWs = "wss://fstream.binance.com";
const baseWs = "wss://fstream.binancefuture.com";

const markPriceWs = () => {
  const wsURL = `${baseWs}/ws/btcusdt@markPrice`;
  const ws = new WebSocket(wsURL);
  ws.on("open", () => {
    console.log("WebSocket connection established.");
  });
  ws.on("message", (msg: any) => {
    //   console.log("Received message:", msg);
    const messageString = msg.toString(); // Convert buffer to string
    const messageJSON = JSON.parse(messageString); // Parse string as JSON
    console.log("Received message:", messageJSON);
  });
  ws.on("error", (error: any) => {
    console.error("WebSocket error:", error);
  });
  ws.on("close", () => {
    console.log("WebSocket connection closed.");
  });
};
// markPriceWs();

const allMarkPriceWs = () => {
  const wsURL = `${baseWs}/ws/!market@arr`; // default is 3s interval
  const ws = new WebSocket(wsURL);
  ws.on("open", () => {
    console.log("WebSocket connection established.");
  });
  ws.on("message", (msg: any) => {
    //   console.log("Received message:", msg);
    const messageString = msg.toString(); // Convert buffer to string
    const messageJSON: TSymbolMarkPriceWs[] = JSON.parse(messageString); // Parse string as JSON

    for (let sym of messageJSON.slice(0, 2)) {
      console.log(sym.e, sym.P);
    }
    console.log("Received message:", messageJSON.slice(0, 2));
  });
  ws.on("error", (error: any) => {
    console.error("WebSocket error:", error);
  });
  ws.on("close", () => {
    console.log("WebSocket connection closed.");
  });
};

// allMarkPriceWs();

const allTickerPriceWs = () => {
  const wsURL = `${baseWs}/ws/!ticker@arr`; // default is 3s interval
  const ws = new WebSocket(wsURL);
  ws.on("open", () => {
    console.log("WebSocket connection established.");
  });
  ws.on("message", (msg: any) => {
    //   console.log("Received message:", msg);
    const messageString = msg.toString(); // Convert buffer to string
    const messageJSON: TSymbolPriceTickerWs[] = JSON.parse(messageString); // Parse string as JSON

    for (let sym of messageJSON) {
      if (sym.s === "BTCUSDT") {
        console.log("lastPrice: ", sym.c);
      }
    }
    // console.log("Received message:", messageJSON.slice(0, 2));
  });
  ws.on("error", (error: any) => {
    console.error("WebSocket error:", error);
  });
  ws.on("close", () => {
    console.log("WebSocket connection closed.");
  });
};
allTickerPriceWs()