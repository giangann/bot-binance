import dotenv from "dotenv";
import { TOrderInfo } from "../types/websocket/order-info.type";
import {
  ableOrderSymbolsMapToArray,
  fakeDelay,
  numberOfBuyOrder,
  orderPiecesToMap,
  pnlOfSymbolFromPositionsMap,
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
  try {
    global.isRunTick = false;

    updatePositionsWebsocket();
    const waitTime = parseInt(process.env.WAIT_POSITION) || 1;
    await fakeDelay(waitTime);

    if (global.isRunTick === false) {
      global.isRunTick = true;
      return;
    }

    loggerService.saveDebugAndClg(`tick able run: ${global.isRunTick}`); // check

    // get opening chain
    const openingChain = global.openingChain;
    if (!openingChain) return;

    // -- Quit if pnl thres hold reach
    const totalPositionPnl = totalPnlFromPositionsMap(global.positionsMap);
    const pnlToStop = openingChain?.pnl_to_stop;
    const pnlToStopNumber = parseFloat(pnlToStop);
    const maxPnlStartNumber = parseFloat(openingChain?.max_pnl_start);
    const maxPnlThresholdToQuitNumber = parseFloat(
      openingChain?.max_pnl_threshold_to_quit
    );
    // calculate neccesary stats
    if (totalPositionPnl >= maxPnlStartNumber) {
      openingChain.is_max_pnl_start_reached = true;
      loggerService.saveDebug(
        `totalPnl reach MAX_PNL_START: ${maxPnlStartNumber}`
      );
    } // pnl reach top
    // decide able to quit or not
    let isAbleToMakeProfit = false;
    if (openingChain.is_max_pnl_start_reached) {
      if (totalPositionPnl <= maxPnlStartNumber * maxPnlThresholdToQuitNumber)
        isAbleToMakeProfit = true;
      if (totalPositionPnl > maxPnlStartNumber)
        openingChain.max_pnl_start = totalPositionPnl.toString();
    }
    const isAbleToCutLoss = totalPositionPnl <= pnlToStopNumber;
    const isAbleToQuit = isAbleToCutLoss || isAbleToMakeProfit;

    if (isAbleToQuit) {
      let stopReason = "";
      if (isAbleToCutLoss)
        stopReason = `Cut loss: PNL = ${totalPositionPnl} <= ${pnlToStopNumber}`;
      if (isAbleToMakeProfit)
        stopReason = `Make profit: PNL = ${totalPositionPnl}, MAX_PNL_START = ${maxPnlStartNumber}, THRESHOLD = ${maxPnlThresholdToQuitNumber}`;

      await marketOrderChainService.update({
        id: openingChain?.id,
        stop_reason: stopReason,
        is_max_pnl_start_reached: openingChain.is_max_pnl_start_reached,
      });
      await quit();
      loggerService.saveDebug(stopReason);
      global.wsServerInstance.emit("bot-quit", stopReason);
    }

    // calculate and place order
    const ableSymbols = ableOrderSymbolsMapToArray(global.ableOrderSymbolsMap);
    evaluateAndPlaceOrderWs(ableSymbols);
  } catch (error: any) {
    loggerService.saveError(error);
  }
};

const evaluateAndPlaceOrderWs = (symbols: string[]) => {
  for (const symbol of symbols) {
    try {
      // -- Get PositionsMap
      const positionsMap = global.positionsMap;
      // -- Get OrderPiecesMap
      const orderPiecesMap = global.orderPiecesMap;
      // -- Get symbolPricesMapStart
      const symbolPricesStartMap = global.symbolPricesStartMap;
      // -- Get symbolTickerPricesMapNow
      const symbolTickerPricesNowMap = global.symbolTickerPricesNowMap;
      // -- Get symbolMarketPricesMapNow
      const symbolMarketPricesNowMap = global.symbolMarketPricesNowMap;

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
        prevPrice =
          openingChain.price_type === "market"
            ? symbolPriceStart?.mark_price
            : symbolPriceStart?.price;
      }
      if (!prevPrice) continue;

      // -- Calculate currPrice
      const symbolMarketPriceNow = symbolMarketPricesNowMap[symbol];
      const symbolTickerPriceNow = symbolTickerPricesNowMap[symbol];
      const currPrice =
        openingChain.price_type === "market"
          ? symbolMarketPriceNow?.markPrice
          : symbolTickerPriceNow?.price;
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
      const isPercentAbleToBuyMore =
        percentChange > percentToBuyNumber || percentChange < -2;

      const isAbleToFirstBuy = isPercentAbleToFirstBuy && !isSymbolHasOrder;
      const isAbleToBuyMore = isPercentAbleToBuyMore && isSymbolHasOrder;
      const isAbleToBuy = isAbleToFirstBuy || isAbleToBuyMore;

      // Sell
      const percentToSell = openingChain.percent_to_sell;
      const percentToSellNumber = parseFloat(percentToSell);
      const isPercentAbleToSell = percentChange < percentToSellNumber;

      const numberOfBuyOrderSymbol = numberOfBuyOrder(orderPiecesOfSymbol);
      const isHasTwoBuyOrderBefore = numberOfBuyOrderSymbol >= 2;

      // If pnl <5$, sell all
      const isHasAtLeastOneOrderBefore = numberOfBuyOrderSymbol >= 1;
      const symbolPositionPnl = pnlOfSymbolFromPositionsMap(
        positionsMap,
        symbol
      );
      const isPnlAbleToSell = symbolPositionPnl < -5;

      const isAbleToSellFirstCondition =
        isPercentAbleToSell && isHasTwoBuyOrderBefore;
      const isAbleToSellSecondCondition =
        isHasAtLeastOneOrderBefore && isPnlAbleToSell;
      const isAbleToSell =
        isAbleToSellFirstCondition || isAbleToSellSecondCondition;

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
      const clientOrderId = placeOrderWebsocket(
        symbol,
        orderQtyValid,
        direction
      );

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
    } catch (error: any) {
      loggerService.saveError(error);
    }
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
    await marketOrderPieceService.createMany(piecesToSave);
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
