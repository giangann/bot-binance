// call multiple rest api to fetch data
// from database, binance system
// process and form the fetched data
// save to ram by underlying the global variable

import {
  getSymbolMarketPrices,
  getSymbolTickerPrices,
} from "../services/binance.service";
import CoinService from "../services/coin-price-1am.service";

const prepareData = async () => {
  const symbolPricesStart = await new CoinService().list();
  const symbolTickerPricesNow = await getSymbolTickerPrices();
  const symbolMarketPricesNow = await getSymbolMarketPrices();

  global.symbolPricesStart = symbolPricesStart;
  global.symbolMarketPricesNow = symbolMarketPricesNow;
  global.symbolTickerPricesNow = symbolTickerPricesNow;
};

export default prepareData;
