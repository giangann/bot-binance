import moment from "moment";
import marketOrderChainService from "./market-order-chain.service";
import binanceService from "./binance.service";
import { TResponseFailure } from "../types/order";
import { positionsToMap } from "../ultils/helper.ultil";
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
async function createOrder(
  chainId: number,
  ...args: Parameters<typeof binanceService.createMarketOrder>
) {
  const positions = await binanceService.getPositions();
  const positionsMap = positionsToMap(positions);
  const positionAmtOfSymbol = parseFloat(positionsMap[args[0]]?.positionAmt);

  const newOrderResponse = await binanceService.createMarketOrder(...args);

  let newDebugLog = "";
  if (newOrderResponse.success === true) {
    const newOrder = newOrderResponse.data;
    const { orderId, symbol, origQty, side } = newOrder;
    newDebugLog = `create new order: ${orderId} ${side} ${origQty} ${symbol}`;
    if (side === "SELL")
      newDebugLog += ` before order has ${positionAmtOfSymbol} ${symbol}`;
  } else {
    const response: TResponseFailure = newOrderResponse;
    const { code, msg } = response.error;
    newDebugLog = `error when create new order: ${code} - ${msg}`;
  }
  console.log(newDebugLog)
  logger.debug(newDebugLog)
}

const quit = async () => {
  await updateOrderChain();
  //   ws emit quit bot
  (global as any).wsServerGlob.emit("bot-quit", "bot was quited");
};

export default {
  quit,
  createOrder
};
