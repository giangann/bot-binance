import { getAndUpdatePositionsEventHandler } from "../ultils/event-handler/get-and-update-positions-handler";
import { newOrderPlaceEvHandlerWs } from "../ultils/event-handler/new-order-placed.handler";
import WebSocket from "ws";

const WEBSOCKET_USER_DATA_STREAM_URL = "wss://fstream.binancefuture.com";
const WEBSOCKET_MARKET_STREAM_URL = "wss://fstream.binancefuture.com";
const WEBSOCKET_API_URL = "wss://testnet.binancefuture.com/ws-fapi/v1";

const BINANCE_API_URL = process.env.BINANCE_BASE_URL;
const apiKey = process.env.BINANCE_API_KEY;
const apiSecret = process.env.BINANCE_API_SECRET;

export function createWebSocketConnectionPlaceOrder() {
  // WebSocket connection
  const ws = new WebSocket(WEBSOCKET_API_URL);

  // Open WebSocket connection
  ws.on("open", () => {
    console.log("WebSocket connection PlaceOrder established");
  });

  // Handle incoming messages
  ws.on("message", newOrderPlaceEvHandlerWs);

  // Handle errors
  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
  });

  // Handle connection close
  ws.on("close", () => {
    console.log("WebSocket connection closed");
  });

  return ws;
}

export function createWebSocketConnectionGetAndUpdatePositions() {
  // WebSocket connection
  const ws = new WebSocket(WEBSOCKET_API_URL);

  // Open WebSocket connection
  ws.on("open", () => {
    console.log("WebSocket connection GetAndUpdatePositions established");
  });

  // Handle incoming messages
  ws.on("message", getAndUpdatePositionsEventHandler);

  // Handle errors
  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
  });

  // Handle connection close
  ws.on("close", () => {
    console.log("WebSocket connection closed");
  });

  return ws;
}

export function createWebSocketConnectionClosePositions() {
  // WebSocket connection
  const ws = new WebSocket(WEBSOCKET_API_URL);

  // Open WebSocket connection
  ws.on("open", () => {
    console.log("WebSocket connection ClosePositions established");
  });

  // Handle incoming messages

  // Handle errors
  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
  });

  // Handle connection close
  ws.on("close", () => {
    console.log("WebSocket connection closed");
  });

  return ws;
}
