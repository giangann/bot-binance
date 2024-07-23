import dotenv from "dotenv";
import { TOrderInfo } from "../types/websocket/order-info.type";
import {
  ableOrderSymbolsMapToArray,
  fakeDelay,
  orderPiecesToMap,
  totalPnlFromPositionsMap,
  validateAmount,
} from "../ultils/helper";
import {
  closePositionWebSocket,
  placeOrderWebsocket,
  updatePositionsWebsocket,
} from "./binance.service";
import loggerService from "./logger.service";
import marketOrderChainService from "./market-order-chain.service";
import marketOrderPieceService from "./market-order-piece.service";
dotenv.config();

const active = async () => {
  const time = parseInt(process.env.BOT_RUN_INTERVAL) || 6; // second
  global.botInterval = setInterval(tick, time * 1000);
};

const tick = async () => {
  global.isRunTick = false;

  updatePositionsWebsocket();
  const waitTime = parseInt(process.env.WAIT_POSITION) || 1
  await fakeDelay(waitTime);

  if (global.isRunTick === false) {
    global.isRunTick = true;
    return;
  }

  loggerService.saveDebugAndClg(`tick able run: ${global.isRunTick}` ); // check

  // quit if pnl thres hold reach
  const totalPositionPnl = totalPnlFromPositionsMap(global.positionsMap);
  const pnlToStop = global.openingChain?.pnl_to_stop;
  const pnlToStopNumber = parseFloat(pnlToStop);
  if (totalPositionPnl <= pnlToStopNumber) {
    const stopMessage = `Reason: PNL = ${totalPositionPnl} <= ${pnlToStopNumber}`;
    await marketOrderChainService.update({
      id: global.openingChain?.id,
      stop_reason: stopMessage,
    });
    await quit();
    loggerService.saveDebug(stopMessage);
    global.wsServerInstance.emit("bot-quit", stopMessage);
  }

  // calculate and place order
  const ableSymbols = ableOrderSymbolsMapToArray(global.ableOrderSymbolsMap);
  evaluateAndPlaceOrderWs(ableSymbols);
};

const evaluateAndPlaceOrderWs = (symbols: string[]) => {
  for (const symbol of symbols) {
    // -- Get PositionsMap
    const positionsMap = global.positionsMap;
    // -- Get OrderPiecesMap
    const orderPiecesMap = global.orderPiecesMap;
    // -- Get symbolPricesMapStart
    const symbolPricesStartMap = global.symbolPricesStartMap;
    // -- Get symbolPricesMapNow
    const symbolTickerPricesNowMap = global.symbolTickerPricesNowMap;

    // -- Calculate prevPrice
    let prevPrice: string | null | undefined = null;
    if (!orderPiecesMap[symbol]) {
      // initial pieces for this symbol
      orderPiecesMap[symbol] = [];
    }
    const orderPiecesOfSymbol = orderPiecesMap[symbol];
    const orderPiecesOfSymbolLen = orderPiecesOfSymbol.length;
    const isSymbolHasOrder = orderPiecesOfSymbolLen > 0;

    if (orderPiecesOfSymbol && isSymbolHasOrder) {
      const lastOrderPiece = orderPiecesOfSymbol[0];
      prevPrice = lastOrderPiece.price;
    } else {
      const symbolPriceStart = symbolPricesStartMap[symbol];
      prevPrice = symbolPriceStart?.price;
    }
    if (!prevPrice) continue;

    // -- Calculate currPrice
    const symbolTickerPriceNow = symbolTickerPricesNowMap[symbol];
    const currPrice = symbolTickerPriceNow?.price;
    if (!currPrice) continue;

    // -- Calculate percentChange
    const prevPriceNumber = parseFloat(prevPrice);
    const currPriceNumber = parseFloat(currPrice);
    const percentChange = (currPriceNumber / prevPriceNumber - 1) * 100;

    // -- Define direction
    // Buy
    const percentToFirstBuy = openingChain.percent_to_first_buy;
    const percentToBuy = openingChain.percent_to_buy;
    const percentToBuyNumber = parseFloat(percentToBuy);
    const percentToFirstBuyNumber = parseFloat(percentToFirstBuy);

    const isPercentAbleToFirstBuy = percentChange > percentToFirstBuyNumber;
    const isPercentAbleToBuyMore = percentChange > percentToBuyNumber;

    const isAbleToFirstBuy = isPercentAbleToFirstBuy && !isSymbolHasOrder;
    const isAbleToBuyMore = isPercentAbleToBuyMore && isSymbolHasOrder;
    const isAbleToBuy = isAbleToFirstBuy || isAbleToBuyMore;

    // Sell
    const percentToSell = openingChain.percent_to_sell;
    const percentToSellNumber = parseFloat(percentToSell);
    const isPercentAbleToSell = percentChange < percentToSellNumber;
    const isAbleToSell = isPercentAbleToSell && orderPiecesOfSymbolLen >= 2;

    let debugMsg = `${symbol} prev: ${prevPrice}; curr: ${currPrice}; percent: ${percentChange}`;

    let direction: "SELL" | "BUY" | "" = "";
    if (isAbleToBuy) direction = "BUY";
    if (isAbleToSell) direction = "SELL";
    if (direction === "") continue;

    // -- Define quantity
    const transactionSizeStart = openingChain.transaction_size_start;
    const orderQtyStart = transactionSizeStart / currPriceNumber;
    let orderQty: number = orderQtyStart;

    if (isAbleToBuy) {
      if (isAbleToBuyMore) {
        const symbolPosition = positionsMap[symbol];
        const positionAmt = symbolPosition?.positionAmt;
        const positionAmtNumber = parseFloat(positionAmt); // number (can be 0), or nan
        // for some precision reason make "has order" symbol have positionAmt =0
        if (!positionAmtNumber) orderQty = orderQtyStart;
        if (positionAmtNumber) orderQty = positionAmtNumber;
      }
      if (isAbleToFirstBuy) {
        orderQty = orderQtyStart;
      }
    }
    if (isAbleToSell) {
      const symbolPosition = positionsMap[symbol];
      const positionAmt = symbolPosition?.positionAmt;
      const positionAmtNumber = parseFloat(positionAmt); // number (can be 0), or nan (if parse from undefined/null)

      if (!positionAmtNumber) continue;
      if (positionAmtNumber) orderQty = positionAmtNumber;
    }
    const precision = exchangeInfoSymbolsMap[symbol]?.quantityPrecision;
    const orderQtyValid = validateAmount(orderQty, precision);

    // -- Place order, get the id generated from uuidV4 for check order info purpose
    const clientOrderId = placeOrderWebsocket(symbol, orderQtyValid, direction);

    // -- Save order info to memory
    // prepare
    const newOrderInfo: TOrderInfo = {
      symbol: symbol,
      amount: orderQtyValid * currPriceNumber, // is transaction size
      currPrice: currPriceNumber,
      prevPrice: prevPriceNumber,
      percentChange: percentChange,
      direction: direction,
      isFirstOrder: !isSymbolHasOrder,
      positionAmt: parseFloat(positionsMap[symbol]?.positionAmt),
      quantity: orderQtyValid,
      quantityPrecision: precision,
    };
    // add new key-val
    global.orderInfosMap[clientOrderId] = newOrderInfo;
  }
};

const quit = async () => {
  // update bot status
  global.isBotActive = false;

  // update chain information database
  const openingChain = global.openingChain;
  const { id } = openingChain;
  await marketOrderChainService.update({ id, status: "closed" });

  // -- store data from memory to database (order pieces)
  //    check data in databaase
  const orderPiecesMem = global.orderPieces;
  const openingChainDetail = await marketOrderChainService.detail(id);
  const piecesOfOpeningChain = openingChainDetail.order_pieces;
  if (piecesOfOpeningChain.length < orderPiecesMem.length) {
    const piecesMap = orderPiecesToMap(piecesOfOpeningChain);
    const piecesToSave = orderPieces.filter(
      ({ id: orderId }) => !(orderId in piecesMap)
    );
    await marketOrderPieceService.createMany(piecesToSave)
  }

  // close positions
  // get positions
  const positionsMap = global.positionsMap;
  const symbols = Object.keys(positionsMap);

  for (let symbol of symbols) {
    const position = positionsMap[symbol];
    const positionAmt = position?.positionAmt;
    const positionAmtNumber = parseFloat(positionAmt);
    if (!positionAmtNumber || positionAmtNumber === 0) continue;

    const direction = "SELL";
    // dont need to validate by precision because when place order its already valid
    const qty = positionAmtNumber;

    // place sell order
    closePositionWebSocket(symbol, qty, direction);
  }

  // clean up memory (remove uneccessary data)
  global.orderPieces = [];
  global.orderPiecesMap = {};
  global.orderInfosMap = {};
  global.ableOrderSymbolsMap = {};

  global.openingChain = null;
  global.symbolPricesStartMap = null;
  global.exchangeInfoSymbolsMap = null;
  global.positionsMap = null;

  clearInterval(global.botInterval);

  // logger
  loggerService.saveDebug("Bot quited");

  return true;
};

export default { active, quit };
