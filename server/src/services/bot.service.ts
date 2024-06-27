import moment from "moment";
import marketOrderChainService from "./market-order-chain.service";
import binanceService from "./binance.service";
import { logger } from "../loaders/logger.config";

async function getChainOpen() {
  const listOpenOrder = await marketOrderChainService.list({ status: "open" });

  return listOpenOrder[0];
}
async function updateOrderChain() {
  try {
    const chainIsOpen = await getChainOpen();

    const updatedRes = await marketOrderChainService.update({
      id: chainIsOpen.id,
      total_balance_end: "0.000",
      percent_change: "0.000", // can't defined
      price_end: "0.000",
      status: "closed",
      updatedAt: moment().format("YYYY-MM-DD HH:mm:ss"),
    });

    return updatedRes;
  } catch (err) {
    console.log("err updateOrderChain", err);
  }
}

// return a promise {symbol, id, }

const quit = async () => {
  await updateOrderChain();
  //   ws emit quit bot
  (global as any).wsServerGlob.emit("bot-quit", "bot was quited");
};

const closeAllPositions = async () => {
  const positions = await binanceService.getPositions();

  // make promises and fullfilled
  const orderPromises = positions.map((position) => {
    let symbol = position.symbol;
    let quantity = parseFloat(position.positionAmt);
    let side: "SELL" | "BUY" = "SELL";
    return binanceService.createMarketOrder(symbol, side, quantity);
  });
  const orderResult = await Promise.all(orderPromises);

  // log and error
  let numOfSuccess = 0;
  let numOfFailure = 0;
  for (let res of orderResult) {
    if (res.success === true) {
      const { orderId, side, origQty, symbol } = res.data;
      numOfSuccess += 1;

      // log order info
      const msg = `orderId: ${orderId}, symbol: ${symbol}, quantity: ${origQty}, side: ${side}`;
      logger.info(msg);
    } else {
      numOfFailure += 1;
      // log error message
      const {
        error: { code, msg },
        payload,
      } = res;
      const { symbol, quantity, side } = payload;
      const logMsg = `${code} - ${msg}, symbol: ${symbol}, quantity: ${quantity}, side: ${side}`;
      logger.info(logMsg);
    }
  }
};

export default {
  quit,
  closeAllPositions,
};
