import { cronJobSchedule } from "./cron-job";
import { connectDatabase } from "./db-connect";
import { getPriceOfSymbols } from "./get-price-of-symbols";
import { createHttpServer } from "./http-server";
import { createWebSocket } from "./ws-server";

export const loadApp = async () => {
  const httpServer = createHttpServer();
  const wsServer = createWebSocket(httpServer);
  global.wsServerGlob = wsServer;
  cronJobSchedule();
  await connectDatabase();
  await getPriceOfSymbols();
  return {
    httpServer,
    wsServer,
  };
};
