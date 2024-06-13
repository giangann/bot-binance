import { createInterval } from "./create-interval";
import { cronJobSchedule } from "./cron-job";
import { connectDatabase } from "./db-connect";
import { createHttpServer } from "./http-server";
import { logger } from "./logger.config";
import { subcribeAndForwardBinanceStream } from "./subcribe-binance-stream";
import { createWebSocket } from "./ws-server";

export const loadApp = async () => {
  try {
    const httpServer = createHttpServer();
    const wsServer = createWebSocket(httpServer);
    global.wsServerGlob = wsServer;
    subcribeAndForwardBinanceStream();
    // cronJobSchedule();
    await connectDatabase();
    createInterval();
    return {
      httpServer,
      wsServer,
    };
  } catch (err) {
    logger.info(`The connection to database was failed with error: ${err}`);
  }
};
