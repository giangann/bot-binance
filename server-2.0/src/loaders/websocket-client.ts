import WebSocket from "ws";
import loggerService from "../services/logger.service";
import { getAndUpdatePositionsEventHandler } from "../ultils/event-handler/get-and-update-positions-handler";
import { newOrderPlaceEvHandlerWs } from "../ultils/event-handler/new-order-placed.handler";
import dotenv from "dotenv";
dotenv.config();

const WEBSOCKET_API_URL = process.env.BINANCE_BASE_WS_API_URL;

export function createWebSocketConnectionPlaceOrder() {
  // WebSocket connection
  const ws = new WebSocket(WEBSOCKET_API_URL);

  // Open WebSocket connection
  ws.on("open", () => {
    loggerService.saveDebugAndClg(
      "WebSocket connection PlaceOrder established"
    );
  });

  // Handle incoming messages
  ws.on("message", newOrderPlaceEvHandlerWs);

  // Handle errors
  ws.on("error", (error) => {
    loggerService.saveError(error);
    console.error("WebSocket error:", error);
  });

  // Handle connection close
  ws.on("close", () => {
    loggerService.saveDebugAndClg("WebSocket connection PlaceOrder closed");
  });

  return ws;
}

export function createWebSocketConnectionGetAndUpdatePositions() {
  // WebSocket connection
  const ws = new WebSocket(WEBSOCKET_API_URL);

  // Open WebSocket connection
  ws.on("open", () => {
    loggerService.saveDebugAndClg(
      "WebSocket connection GetAndUpdatePositions established"
    );
  });

  // Handle incoming messages
  ws.on("message", getAndUpdatePositionsEventHandler);

  // Handle errors
  ws.on("error", (error) => {
    loggerService.saveError(error);
    console.error("WebSocket error:", error);
  });

  // Handle connection close
  ws.on("close", () => {
    loggerService.saveDebugAndClg("WebSocket connection GetAndUpdatePositions closed");
  });

  return ws;
}

export function createWebSocketConnectionClosePositions() {
  // WebSocket connection
  const ws = new WebSocket(WEBSOCKET_API_URL);

  // Open WebSocket connection
  ws.on("open", () => {
    loggerService.saveDebugAndClg(
      "WebSocket connection ClosePositions established"
    );
  });

  // Handle incoming messages

  // Handle errors
  ws.on("error", (error) => {
    loggerService.saveError(error);
    console.error("WebSocket error:", error);
  });

  // Handle connection close
  ws.on("close", () => {
    loggerService.saveDebugAndClg("WebSocket connection ClosePositions closed");
  });

  return ws;
}
