import { IBotActive } from "bot.interface";
import { IMarketOrderPieceCreate } from "market-order-piece.interface";
import moment from "moment";
import { compareDate, priceToPercent } from "../ultils/helper.ultil";
import binanceService from "./binance.service";
import coinService from "./coin.service";
import marketOrderPieceService from "./market-order-piece.service";

var interval: string | number | NodeJS.Timeout = null;
const active = async (params: IBotActive, chainId: number) => {
  interval = setInterval(async () => {
    try {
      await tick(params, chainId);
    } catch (err) {
      console.log(err);
      return false;
    }
  }, 5000);
  return true;
};

async function tick(params: IBotActive, chainId: number) {
  let {
    symbol,
    transaction_size,
    transaction_increase,
    percent_to_buy,
    percent_to_sell,
  } = params;

  const directionRes = await toDirection(
    symbol,
    percent_to_buy,
    percent_to_sell
  );
  const direction = directionRes?.direction;
  const percent_change = directionRes?.result;

  console.log("direction", direction);
  const isExecute = Boolean(direction);

  console.log("isExecute", isExecute);
  if (isExecute) {
    const currPrice = await binanceService.getSymbolPriceNow(symbol);

    if (direction === "buy") {
      transaction_size += transaction_increase;
    }
    if (direction === "sell") {
      transaction_size -= transaction_increase / 2;
    }
    const order_amount = transaction_size / currPrice;

    const newMarketOrder = await binanceService.createMarketOrder(
      symbol,
      direction,
      order_amount
    );

    const { id, symbol: order_symbol, price, amount } = newMarketOrder;
    console.log(id, order_symbol, price, amount);

    await saveOrderPiece({
      id,
      market_order_chains_id: chainId,
      percent_change: percent_change.toString(),
      price: price.toString(),
      symbol,
      total_balance: (await binanceService.getMyBalance()).total.toString(),
    });

    wsServerGlob.emit(
      "new-order",
      direction,
      transaction_size,
      percent_change.toString(),
      price.toString(),
      symbol
    );
  }

  console.log("bot is running");
  // ws emit bot is running
  wsServerGlob.emit(
    "bot-running",
    "bot đang chạy, bỏ qua checkpoint do chênh lệch giá không đủ điều kiện, check lại sau 5s "
  );
}

async function saveOrderPiece(params: IMarketOrderPieceCreate) {
  await marketOrderPieceService.create(params);
}

// if null, dont do any thing
type TDirection = {
  direction: "sell" | "buy";
  result: number;
};
async function toDirection(
  symbol: string,
  percentToBuy: number,
  percentToSell: number
): Promise<TDirection | null> {
  const percentChange = await calculatePercentChange(symbol);
  console.log(percentChange, percentToBuy, percentToSell);
  if (percentChange > percentToBuy)
    return { direction: "buy", result: percentChange };
  if (percentChange < percentToSell)
    return { direction: "sell", result: percentChange };

  return null;
}

async function calculatePercentChange(symbol: string): Promise<number> {
  const isHasOrderToday = await todayHasOrder(symbol);
  const prevPrice = await getPrevPrice(symbol, isHasOrderToday);
  const currPrice = await binanceService.getSymbolPriceNow(symbol);
  const pricePercentChange = priceToPercent(prevPrice, currPrice);
  return pricePercentChange;
}

async function getPrevPrice(symbol: string, todayHasOrder: boolean) {
  let prevPrice: string = "";
  if (todayHasOrder) {
    const lastOrder = await getLastOrder(symbol);
    prevPrice = lastOrder.price;
  } else {
    const coin = await coinService.detail({ symbol });
    prevPrice = coin.price;
  }
  console.log("symbol ", symbol, " prev price ", prevPrice);
  return parseFloat(prevPrice);
}

async function getLastOrder(symbol: string) {
  let orders = await marketOrderPieceService.list({
    createdAt: moment().format("YYYY-MM-DD"),
    symbol: symbol,
  });
  let orderSortByDate = orders.sort((a, b) =>
    compareDate(a.createdAt, b.createdAt)
  );
  return orderSortByDate[0];
}

async function todayHasOrder(symbol: string): Promise<boolean> {
  let isSymbolHasOrderToday: boolean;
  let orders = await marketOrderPieceService.list({
    createdAt: moment().format("YYYY-MM-DD"),
    symbol: symbol,
  });
  if (orders.length !== 0) isSymbolHasOrderToday = true;
  return isSymbolHasOrderToday;
}

const quit = () => {
  clearInterval(interval);
  wsServerGlob.emit("bot-quit", "bot was quited");
  //   ws emit quit bot
};

export default {
  active,
  quit,
};
