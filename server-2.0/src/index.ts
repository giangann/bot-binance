import prepareDataBot from "./loaders/data-prepare-bot";
import { connectDatabase } from "./loaders/db-connect";
import constructHttpServer from "./loaders/http-server";
import { createWebSocketConnectionClosePositions, createWebSocketConnectionGetAndUpdatePositions, createWebSocketConnectionPlaceOrder } from "./loaders/websocket-client";
import { createListMessages } from "./mock/ws-messages";
import loggerService from "./services/logger.service";
import marketOrderChainService from "./services/market-order-chain.service";
import { tickerPricesUpdateEvHandlerWs } from "./ultils/event-handler/ticker-prices-update.handler";

const start = async () => {
  try {
    await connectDatabase();
    constructHttpServer()
    await prepareDataBot();
    // 
    global.orderPlaceWsConnection = createWebSocketConnectionPlaceOrder();
    global.updatePositionsWsConnection = createWebSocketConnectionGetAndUpdatePositions();
    global.closePositionsWsConnection = createWebSocketConnectionClosePositions()

    // create new chain ////////////////////////////////////////////////////////////////
    let params = {
      transaction_size_start: 10,
      percent_to_first_buy: '4',
      percent_to_buy: '5',
      percent_to_sell: '-2.5',
      pnl_to_stop: '0.0', // not related
    };
    const newOrderChain = await marketOrderChainService.create({
      status: "open",
      price_start: "0.000", // can't defined
      total_balance_start: "0.000", // can't defined
      ...params,
    });
    // update global data
    global.openingChain = newOrderChain;
    ////////////////////////////////////////////////////////////////////////////////////////////////

    const symbolTickerPricesNow = global.symbolTickerPricesNow
    // generate message
    const listMessagesWs = createListMessages(symbolTickerPricesNow);

    // initial count variable
    let count = 0;
    const intervalTime = 3000; //ms

    // creat interval (3s)
    const interval = setInterval(() => {
      // 0. get message (listMessageWs[count])
      const message = Buffer.from(JSON.stringify(listMessagesWs[count]));
      // 1. call handle update with message
      tickerPricesUpdateEvHandlerWs(message);
      // 2. update count+=1
      count = count + 1;
      // 3. condition when count = listMessageLength then clearInterval
      if (count >= listMessagesWs.length) {
        loggerService.saveDebugAndClg('stop interval')
        clearInterval(interval)
      };
    }, intervalTime);

  } catch (err) {
    loggerService.saveError(err);
    console.log(err);
  }
};

start();
