"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWebSocketConnectionClosePositions = exports.createWebSocketConnectionGetAndUpdatePositions = exports.createWebSocketConnectionPlaceOrder = void 0;
const get_and_update_positions_handler_1 = require("../ultils/event-handler/get-and-update-positions-handler");
const new_order_placed_handler_1 = require("../ultils/event-handler/new-order-placed.handler");
const ws_1 = __importDefault(require("ws"));
const WEBSOCKET_USER_DATA_STREAM_URL = "wss://fstream.binancefuture.com";
const WEBSOCKET_MARKET_STREAM_URL = "wss://fstream.binancefuture.com";
const WEBSOCKET_API_URL = "wss://testnet.binancefuture.com/ws-fapi/v1";
const BINANCE_API_URL = process.env.BINANCE_BASE_URL;
const apiKey = process.env.BINANCE_API_KEY;
const apiSecret = process.env.BINANCE_API_SECRET;
function createWebSocketConnectionPlaceOrder() {
    // WebSocket connection
    const ws = new ws_1.default(WEBSOCKET_API_URL);
    // Open WebSocket connection
    ws.on("open", () => {
        console.log("WebSocket connection PlaceOrder established");
    });
    // Handle incoming messages
    ws.on("message", new_order_placed_handler_1.newOrderPlaceEvHandlerWs);
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
exports.createWebSocketConnectionPlaceOrder = createWebSocketConnectionPlaceOrder;
function createWebSocketConnectionGetAndUpdatePositions() {
    // WebSocket connection
    const ws = new ws_1.default(WEBSOCKET_API_URL);
    // Open WebSocket connection
    ws.on("open", () => {
        console.log("WebSocket connection GetAndUpdatePositions established");
    });
    // Handle incoming messages
    ws.on("message", get_and_update_positions_handler_1.getAndUpdatePositionsEventHandler);
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
exports.createWebSocketConnectionGetAndUpdatePositions = createWebSocketConnectionGetAndUpdatePositions;
function createWebSocketConnectionClosePositions() {
    // WebSocket connection
    const ws = new ws_1.default(WEBSOCKET_API_URL);
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
exports.createWebSocketConnectionClosePositions = createWebSocketConnectionClosePositions;
