import prepareData from "./loaders/data-prepare";
import { connectDatabase } from "./loaders/db-connect";
import constructHttpServer from "./loaders/http-server";
import { subcribeAndForwardBinanceStream } from "./loaders/market-data-stream";
import { listenSymbolTickerPricesStreamWs } from "./loaders/ticker-prices-update";
import {
  createWebSocketConnectionClosePositions,
  createWebSocketConnectionGetAndUpdatePositions,
  createWebSocketConnectionPlaceOrder,
} from "./loaders/websocket-client";
import { createWebSocketServerInstance } from "./loaders/websocket-server";

const start = async () => {
  try {
    await connectDatabase();
    await prepareData();
    const httpServer = constructHttpServer();
    const wsServer = createWebSocketServerInstance(httpServer);

    global.isBotActive = false;
    global.wsServerInstance = wsServer;
    global.orderPlaceWsConnection = createWebSocketConnectionPlaceOrder();
    global.updatePositionsWsConnection = createWebSocketConnectionGetAndUpdatePositions();
    global.closePositionsWsConnection = createWebSocketConnectionClosePositions()

    // initial other global variable
    global.orderInfosMap = {}
    global.orderPieces = []
    global.orderPiecesMap = {}
    global.ableOrderSymbolsMap = {}
    global.tickCount = 0

    subcribeAndForwardBinanceStream();
    listenSymbolTickerPricesStreamWs();

  } catch (err) {
    console.log(err);
  }
};

start();
