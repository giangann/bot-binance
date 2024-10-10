import { connectDatabase } from "./loaders/db-connect";
import constructHttpServer from "./loaders/http-server";
import { subcribeAndForwardBinanceStream } from "./loaders/market-data-stream";
import { createWebSocketServerInstance } from "./loaders/websocket-server";
import loggerService from "./services/logger.service";

// construct http server
const start = async () => {
  try {
    await connectDatabase();
    const httpServer = constructHttpServer();
    const wsInstance = createWebSocketServerInstance(httpServer);

    global.wsServerInstance = wsInstance;

    subcribeAndForwardBinanceStream();
  } catch (error) {
    loggerService.saveError(error);
  }
};

start();
