import loggerService from "../services/logger.service";
import { tickerPricesUpdateEvHandlerWs } from "../ultils/event-handler/ticker-prices-update.handler";
import { WebSocket } from "ws";
import dotenv from 'dotenv'
dotenv.config()

const listenSymbolTickerPricesStreamWs = () => {
  const baseWs = process.env.BINANCE_BASE_WS_API_URL;
  const wsURL = `${baseWs}/ws/!ticker@arr`; // default is 1s interval

  const ws = new WebSocket(wsURL);
  ws.on("open", () => {
    loggerService.saveDebugAndClg("WebSocket Binance Market Data Stream (!ticker@arr) connection established, ready to place order each update");
  });

  ws.on("message", tickerPricesUpdateEvHandlerWs);

  ws.on("error", (error: any) => {
    loggerService.saveError(error)
    console.error("WebSocket error:", error);
  });
  ws.on("close", () => {
    loggerService.saveDebugAndClg("WebSocket connection closed.");
  });
};

export { listenSymbolTickerPricesStreamWs };
