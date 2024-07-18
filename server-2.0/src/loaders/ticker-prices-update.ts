import { tickerPricesUpdateEvHandlerWs } from "../ultils/event-handler/ticker-prices-update.handler";
import { WebSocket } from "ws";

const listenSymbolTickerPricesStreamWs = () => {
  const baseWs = "wss://fstream.binance.com";
  const wsURL = `${baseWs}/ws/!ticker@arr`; // default is 1s interval

  const ws = new WebSocket(wsURL);
  ws.on("open", () => {
    console.log("WebSocket Binance Market Data Stream (!ticker@arr) connection established, ready to place order each update");
  });

  ws.on("message", tickerPricesUpdateEvHandlerWs);

  ws.on("error", (error: any) => {
    console.error("WebSocket error:", error);
  });
  ws.on("close", () => {
    console.log("WebSocket connection closed.");
  });
};

export { listenSymbolTickerPricesStreamWs };
