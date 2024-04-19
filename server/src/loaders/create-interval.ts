import {
  IMarketOrderPieceCreate,
  IMarketOrderPieceEntity,
} from "market-order-piece.interface";
import moment from "moment";
import binanceService from "../services/binance.service";
import coinService from "../services/coin.service";
import marketOrderChainService from "../services/market-order-chain.service";
import marketOrderPieceService from "../services/market-order-piece.service";
import { arrayToMap } from "./get-price-of-symbols";
import { IMarketOrderChainEntity } from "market-order-chain.interface";
import { Socket } from "socket.io";

const createInterval = () => {
  const interval = setInterval(async () => {
    console.log("start tick");

    // fetch now symbols price
    const symbols = await coinService.getAllSymbolsDB();
    const prices = await binanceService.getSymbolsClosePrice(symbols);
    global.symbolsPriceMap = arrayToMap(prices);
    global.wsServerGlob.emit("symbols-price", prices);

    // calculate total
    const { total_balance_usdt, coins } = await calCulateBalance();
    global.wsServerGlob.emit("ws-balance", total_balance_usdt, coins);

    // make order
    const chainOpen = await getChainOpen();
    if (chainOpen) {
      const { orderParams, orderPieceParams } = await genOrderParams();
      console.log(
        "found ",
        orderParams.length,
        " coin need to order is",
        orderParams
      );
      const binanceOrdersCreated = await makeOrders(orderParams);
      console.log("binance order arr", binanceOrdersCreated);

      let newOrderPieceParams: IMarketOrderPieceCreate[] = [];
      for (let createdOrder of binanceOrdersCreated) {
        if (createdOrder) {
          for (let orderPieceParam of orderPieceParams) {
            let createdSymbol =
              createdOrder.info?.symbol || createdOrder.symbol;
            let hasBackSlash = createdSymbol.includes("/");
            if (hasBackSlash) {
              createdSymbol = createdSymbol.split("/").join("");
            }
            if (createdSymbol === orderPieceParam.symbol) {
              newOrderPieceParams.push({
                ...orderPieceParam,
                id: createdOrder.id,
              });
            }
          }
        }
      }

      // save order pieces
      console.log("newOrderPieceParams", newOrderPieceParams);
      const newOrderPieces = await saveOrderPieces(newOrderPieceParams);
      global.wsServerGlob.emit("new-orders", newOrderPieces.length);
    }

    console.log("emit and end tick");
  }, 10000);

  global.tickInterval = interval;
};

async function calCulateBalance() {
  const balances = await binanceService.fetchMyBalance();
  const balancesTotalObj = balances.total as unknown as {
    [key: string]: number; // coinName: amount
  };
  const currCoins: string[] = Object.keys(balancesTotalObj);
  let totalBalancesUSDT = balancesTotalObj["USDT"]; // init with usdt amount
  let coinsBalances: {
    coin: string;
    amount: number;
    price: number;
    total: number;
  }[] = [];

  // loop to calculate totalBalances to Usdt
  for (let coinName of currCoins) {
    let coinSymbolUSDT = coinName + "USDT";
    let symbolPrice = global.symbolsPriceMap[coinSymbolUSDT]?.price;

    if (symbolPrice) {
      let coinAmount = balancesTotalObj[coinName];
      let coinTotal = coinAmount * symbolPrice;
      let coinObj = {
        coin: coinName,
        amount: coinAmount,
        price: symbolPrice,
        total: coinTotal,
      };

      totalBalancesUSDT += coinTotal;
      coinsBalances.push(coinObj);
    }
  }

  // log info to console
  let consoleMsg = `Total: ${currCoins.length} in balance, calculated: ${
    coinsBalances.length
  }, can't calculated: ${currCoins.length - coinsBalances.length}`;
  console.log(consoleMsg);

  // save to global
  global.totalBalancesUSDT = totalBalancesUSDT;

  return { total_balance_usdt: totalBalancesUSDT, coins: coinsBalances };
}

type TOrderParams = {
  symbol: string;
  direction: "buy" | "sell";
  amount: number;
  percent?: number;
};
async function makeOrders(orderParams: TOrderParams[]) {
  const promises = orderParams.map(async (param) => {
    const { symbol, amount, direction } = param;
    try {
      return await binanceService.createMarketOrder(symbol, direction, amount);
    } catch (error) {
      console.error(`Error creating order for ${symbol}:`, error.message);
      // Return a placeholder value or handle the error as needed
      return null; // or throw error; depending on your error handling strategy
    }
  });

  return Promise.all(promises);
}
async function saveOrderPieces(orderPieceParams: IMarketOrderPieceCreate[]) {
  return Promise.all(
    orderPieceParams.map(async (param) => {
      return await marketOrderPieceService.create(param);
    })
  );
}
async function genOrderParams() {
  // to get able symbols, each symbols should be calculate percent price change
  const symbols = Object.keys(global.symbolsPriceMap);
  // get today orderPieces map
  const orderPiecesMap = await toDayOrderPiecesMap();
  // get coin 1 am prices map
  const coin1AmPricesMap = await coin1AmSymbolPricesMap();
  // init order params
  let orderParams: TOrderParams[] = [];
  let orderPieceParams: Omit<IMarketOrderPieceCreate, "id">[] = [];
  // get chain is open
  const openChain = await getChainOpen();
  const { percent_to_buy, percent_to_sell, transaction_size_start } = openChain;
  const percentToBuy = parseFloat(percent_to_buy);
  const percentToSell = parseFloat(percent_to_sell);

  for (let symbolKey of symbols) {
    let transaction_size: number = transaction_size_start;
    let percentChange: number = 0;
    let currPrice = global.symbolsPriceMap[symbolKey].price;
    let isTodayHasOrder: boolean;

    // already have order today
    if (symbolKey in orderPiecesMap) {
      let prevPrice = parseFloat(orderPiecesMap[symbolKey].price);
      percentChange = (currPrice / prevPrice - 1) * 100;
      isTodayHasOrder = true;
    }
    // first order of day
    else {
      let prevPrice = parseFloat(coin1AmPricesMap[symbolKey].price);
      percentChange = (currPrice / prevPrice - 1) * 100;
      isTodayHasOrder = false;
    }

    let direction: "buy" | "sell" | null = null;
    if (percentChange >= percentToBuy) direction = "buy";
    if (percentChange <= percentToSell) direction = "sell";
    if (percentChange < percentToSell && percentChange > percentToBuy)
      direction = null;

    // define transaction_size
    if (isTodayHasOrder) {
      let base = direction === "buy" ? 2 : 0.5;
      transaction_size =
        parseFloat(orderPiecesMap[symbolKey].transaction_size) * base;
    } else {
      transaction_size =
        direction === "buy"
          ? transaction_size_start
          : transaction_size_start / 2;
    }

    // define param
    if (direction) {
      let orderParam: TOrderParams = {
        amount: transaction_size / currPrice,
        direction,
        symbol: symbolKey,
      };
      orderParams.push(orderParam);

      let orderPieceParam: Omit<IMarketOrderPieceCreate, "id"> = {
        direction,
        market_order_chains_id: openChain.id,
        percent_change: percentChange.toString(),
        price: currPrice.toString(),
        symbol: symbolKey,
        total_balance: "0.0000",
        amount: (transaction_size / currPrice).toString(),
        transaction_size: transaction_size.toString(),
      };
      orderPieceParams.push(orderPieceParam);
    }
  }

  return { orderParams, orderPieceParams };
}

type ICoinPricesMap = { [symbol: string]: { symbol: string; price: string } };
async function coin1AmSymbolPricesMap() {
  const coin1AmPrices = await coinService.list();
  let res: ICoinPricesMap = {};
  for (let piece of coin1AmPrices) {
    let key = piece.symbol;
    if (!(key in res)) {
      res[key] = piece;
    }
  }
  return res;
}

async function toDayOrderPiecesMap() {
  const orderPieces = await marketOrderPieceService.list({
    createdAt: moment().format("YYYY-MM-DD"),
  });
  const orderPiecesMap = createOrderPiecesMap(orderPieces);
  return orderPiecesMap;
}

// if order with same symbol, get only 1 latest order
type IOrderPiecesMap = { [symbol: string]: IMarketOrderPieceEntity };
function createOrderPiecesMap(
  orderPieces: IMarketOrderPieceEntity[]
): IOrderPiecesMap {
  let res: IOrderPiecesMap = {};
  for (let piece of orderPieces) {
    let key = piece.symbol;
    if (!(key in res)) {
      res[key] = piece;
    }
  }
  return res;
}
async function getChainOpen(): Promise<IMarketOrderChainEntity | null> {
  const openChain = await marketOrderChainService.list({ status: "open" });
  if (openChain.length) return openChain[0];
  else return null;
}

export { createInterval };
