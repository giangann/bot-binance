// call multiple rest api to fetch data
// from database, binance system
// process and form the fetched data
// save to ram by underlying the global variable

import loggerService from "../services/logger.service";
import {
  getExchangeInfo,
  getPositions,
  getSymbolMarketPrices,
  getSymbolTickerPrices,
} from "../services/binance.service";
import CoinService from "../services/coin-price-1am.service";
import {
  ableOrderSymbolsToMap,
  exchangeInfoSymbolsToMap,
  positionsToMap,
  symbolPriceMarketsToMap,
  symbolPriceTickersToMap,
  symbolPricesToMap,
} from "../ultils/helper";
import dotenv from "dotenv";
dotenv.config();

const prepareDataBot = async () => {
  // Fetch data
  // const promises = [getExchangeInfo(), getSymbolTickerPrices(), new CoinService().list(), getPositions()]
  // const [exchangeInfo,symbolTickerPricesNow,symbolPricesStart,positions ] = await Promise.all(promises)
  const exchangeInfo = await getExchangeInfo();
  const symbolTickerPricesNow = await getSymbolTickerPrices();
  const symbolMarketPricesNow = await getSymbolMarketPrices();
  const symbolPricesStart = await new CoinService().list();
  const positions = await getPositions();

  // Process data
  const symbolPricesStartMap = symbolPricesToMap(symbolPricesStart);
  const { symbols } = exchangeInfo;
  const exchangeInfoSymbolsMap = exchangeInfoSymbolsToMap(symbols);
  const positionsMap = positionsToMap(positions);
  const ableOrderSymbols = Object.keys(symbolPricesStartMap);
  const ableOrderSymbolsMap = ableOrderSymbolsToMap(ableOrderSymbols);

  global.symbolPricesStartMap = symbolPricesStartMap;
  global.symbolTickerPricesNowMap = symbolPriceTickersToMap(
    symbolTickerPricesNow
  );
  global.symbolMarketPricesNowMap = symbolPriceMarketsToMap(
    symbolMarketPricesNow
  );
  global.exchangeInfoSymbolsMap = exchangeInfoSymbolsMap;
  global.positionsMap = positionsMap;
  global.ableOrderSymbolsMap = ableOrderSymbolsMap;

  // initial other global variable
  global.orderInfosMap = {};
  global.orderPieces = [];
  global.orderPiecesMap = {};
  global.isBotActive = true;
};

export default prepareDataBot;
