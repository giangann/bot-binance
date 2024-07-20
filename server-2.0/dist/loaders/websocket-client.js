"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWebSocketConnectionClosePositions = exports.createWebSocketConnectionGetAndUpdatePositions = exports.createWebSocketConnectionPlaceOrder = void 0;
const ws_1 = __importDefault(require("ws"));
const logger_service_1 = __importDefault(require("../services/logger.service"));
const get_and_update_positions_handler_1 = require("../ultils/event-handler/get-and-update-positions-handler");
const new_order_placed_handler_1 = require("../ultils/event-handler/new-order-placed.handler");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const WEBSOCKET_API_URL = process.env.BINANCE_BASE_WS_API_URL;
function createWebSocketConnectionPlaceOrder() {
    // WebSocket connection
    const ws = new ws_1.default(WEBSOCKET_API_URL);
    // Open WebSocket connection
    ws.on("open", () => {
        logger_service_1.default.saveDebugAndClg("WebSocket connection PlaceOrder established");
    });
    // Handle incoming messages
    ws.on("message", new_order_placed_handler_1.newOrderPlaceEvHandlerWs);
    // Handle errors
    ws.on("error", (error) => {
        logger_service_1.default.saveError(error);
        console.error("WebSocket error:", error);
    });
    // Handle connection close
    ws.on("close", () => {
        logger_service_1.default.saveDebugAndClg("WebSocket connection PlaceOrder closed");
    });
    return ws;
}
exports.createWebSocketConnectionPlaceOrder = createWebSocketConnectionPlaceOrder;
function createWebSocketConnectionGetAndUpdatePositions() {
    // WebSocket connection
    const ws = new ws_1.default(WEBSOCKET_API_URL);
    // Open WebSocket connection
    ws.on("open", () => {
        logger_service_1.default.saveDebugAndClg("WebSocket connection GetAndUpdatePositions established");
    });
    // Handle incoming messages
    ws.on("message", get_and_update_positions_handler_1.getAndUpdatePositionsEventHandler);
    // Handle errors
    ws.on("error", (error) => {
        logger_service_1.default.saveError(error);
        console.error("WebSocket error:", error);
    });
    // Handle connection close
    ws.on("close", () => {
        logger_service_1.default.saveDebugAndClg("WebSocket connection GetAndUpdatePositions closed");
    });
    return ws;
}
exports.createWebSocketConnectionGetAndUpdatePositions = createWebSocketConnectionGetAndUpdatePositions;
function createWebSocketConnectionClosePositions() {
    // WebSocket connection
    const ws = new ws_1.default(WEBSOCKET_API_URL);
    // Open WebSocket connection
    ws.on("open", () => {
        logger_service_1.default.saveDebugAndClg("WebSocket connection ClosePositions established");
    });
    // Handle incoming messages
    // Handle errors
    ws.on("error", (error) => {
        logger_service_1.default.saveError(error);
        console.error("WebSocket error:", error);
    });
    // Handle connection close
    ws.on("close", () => {
        logger_service_1.default.saveDebugAndClg("WebSocket connection ClosePositions closed");
    });
    return ws;
}
exports.createWebSocketConnectionClosePositions = createWebSocketConnectionClosePositions;
