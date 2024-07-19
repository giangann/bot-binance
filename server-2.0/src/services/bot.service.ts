// // @ts-nocheck
import { TOrderInfo } from "../types/websocket/order-info.type";
import {
  ableOrderSymbolsToMap,
  exchangeInfoSymbolsToMap,
  positionsToMap,
  symbolPricesToMap,
  validateAmount,
} from "../ultils/helper";
import {
  closePositionWebSocket,
  getExchangeInfo,
  getPositions,
  getSymbolTickerPrices,
  placeOrderWebsocket,
} from "./binance.service";
import CoinService from "./coin-price-1am.service";
import loggerService from "./logger.service";
import marketOrderChainService from "./market-order-chain.service";
import marketOrderPieceService from "./market-order-piece.service";
const active = async () => {
  // Fetch data
  // const promises = [getExchangeInfo(), getSymbolTickerPrices(), new CoinService().list(), getPositions()]
  // const [exchangeInfo,symbolTickerPricesNow,symbolPricesStart,positions ] = await Promise.all(promises)
  const exchangeInfo = await getExchangeInfo();
  const symbolTickerPricesNow = await getSymbolTickerPrices();
  const symbolPricesStart = await new CoinService().list();
  const positions = await getPositions();

  // Process data
  const symbolPricesStartMap = symbolPricesToMap(symbolPricesStart);
  const { symbols } = exchangeInfo;
  const exchangeInfoSymbolsMap = exchangeInfoSymbolsToMap(symbols);
  const positionsMap = positionsToMap(positions);
  const ableOrderSymbols = Object.keys(symbolPricesStartMap);
  const ableOrderSymbolsMap = ableOrderSymbolsToMap(ableOrderSymbols);

  // Update data in memory
  global.symbolTickerPricesNow = symbolTickerPricesNow;
  global.symbolPricesStart = symbolPricesStart;
  global.symbolPricesStartMap = symbolPricesStartMap;
  global.exchangeInfoSymbolsMap = exchangeInfoSymbolsMap;
  global.positionsMap = positionsMap;
  global.ableOrderSymbolsMap = ableOrderSymbolsMap;

  // get opening chain
  const openingChain = global.openingChain;

  // Make first tick or orders
  for (let symbolTickerPrice of symbolTickerPricesNow) {
    const symbol = symbolTickerPrice.symbol;

    // get price start
    const symbolPriceStart = global.symbolPricesStartMap[symbol];
    const priceStart = symbolPriceStart?.price;
    if (!priceStart) continue;

    // get price now
    const priceNow = symbolTickerPrice.price;
    if (!priceNow) continue;

    // percent change
    const priceStartNumber = parseFloat(priceStart);
    const priceNowNumber = parseFloat(priceNow);
    const percentChange = (priceNowNumber / priceStartNumber - 1) * 100;

    // decide to first buy or not
    const percentToFirstBuy = openingChain.percent_to_first_buy;
    const percentToFirstBuyNumber = parseFloat(percentToFirstBuy);
    if (percentChange > percentToFirstBuyNumber) {
      // calculate quantity
      const transactionSizeNumber = openingChain.transaction_size_start;
      const buyQty = transactionSizeNumber / priceNowNumber;
      const precision = exchangeInfoSymbolsMap[symbol]?.quantityPrecision;
      const buyQtyValid = validateAmount(buyQty, precision);
      const direction = "BUY";
      // prepare
      const newOrderInfo: TOrderInfo = {
        symbol: symbol,
        amount: buyQtyValid * priceNowNumber, // is transaction size
        currPrice: priceNowNumber,
        prevPrice: priceStartNumber,
        percentChange: percentChange,
        direction: direction,
        isFirstOrder: true,
        positionAmt: 0,
        quantity: buyQtyValid,
        quantityPrecision: precision,
      };
      // -- Place order, get the id generated from uuidV4 for check order info purpose
      const cb = (uuid: string) => {
        // add new key-val
        global.orderInfosMap[uuid] = newOrderInfo;
      };
      placeOrderWebsocket(symbol, buyQtyValid, direction, cb);
    }
  }

  // Update status of Bot as active after a timeout
  setTimeout(() => {
    global.isBotActive = true;
    // logger
    loggerService.saveDebug("Bot actived");
  }, 3000);
  // global.isBotActive = true;
};

const quit = async () => {
  // update bot status
  global.isBotActive = false;

  // update chain information database
  const openingChain = global.openingChain;
  const { id } = openingChain;
  await marketOrderChainService.update({ id, status: "closed" });

  // store data from memory to database (order pieces)
  const orderPieces = global.orderPieces;
  const promiseArr = orderPieces.map((piece) => {
    return marketOrderPieceService.create(piece);
  });
  const orderPiecesCreatedResponse = await Promise.all(promiseArr);

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
  global.tickCount = 0;

  global.openingChain = null;
  global.symbolPricesStart = null;
  global.symbolPricesStartMap = null;
  global.symbolTickerPricesNow = null;
  global.exchangeInfoSymbolsMap = null;
  global.positionsMap = null;

  // logger
  loggerService.saveDebug("Bot quited");

  return orderPiecesCreatedResponse;
};

export default { active, quit };
