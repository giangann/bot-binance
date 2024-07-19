import prepareDataBot from "./loaders/data-prepare-bot";
import { connectDatabase } from "./loaders/db-connect";
import { createWebSocketConnectionClosePositions, createWebSocketConnectionGetAndUpdatePositions, createWebSocketConnectionPlaceOrder } from "./loaders/websocket-client";
import { createListMessages } from "./mock/ws-messages";
import { getSymbolTickerPrices } from "./services/binance.service";
import loggerService from "./services/logger.service";
import { tickerPricesUpdateEvHandlerWs } from "./ultils/event-handler/ticker-prices-update.handler";

const start = async () => {
  try {
    await connectDatabase();
    await prepareDataBot();
    // 
    global.orderPlaceWsConnection = createWebSocketConnectionPlaceOrder();
    global.updatePositionsWsConnection = createWebSocketConnectionGetAndUpdatePositions();
    global.closePositionsWsConnection = createWebSocketConnectionClosePositions()
    // get symbol ticker price now
    const symbolTickerPricesNow = await getSymbolTickerPrices();

    // generate message
    const listMessagesWs = createListMessages();

    // initial count variable
    let count = 0;
    const intervalTime = 3000; //ms

    // creat interval (3s)
    const interval = setInterval(() => {
      // 0. get message (listMessageWs[count])
      const message = Buffer.from(JSON.stringify(listMessagesWs[count]));
      // 1. call handle update with message
      console.log("new message received: ", message.length, "count: ", count);
      tickerPricesUpdateEvHandlerWs(message);
      // 2. update count+=1
      count = count + 1;
      // 3. condition when count = listMessageLength then clearInterval
      if (count >= listMessagesWs.length) {
        console.log('stop interval')
        clearInterval(interval)
      };
    }, intervalTime);

  } catch (err) {
    loggerService.saveError(err);
    console.log(err);
  }
};

start();
