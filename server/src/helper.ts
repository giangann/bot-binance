import { IDatasetItemRecord } from "./interfaces/dataset-item.interface";
import { TOrder, TSymbolPrice, TSymbolPrices, TSymbolPricesMap } from "./type";
import { TSymbolMarketPrice, TSymbolTickerPrice } from "./types/rest-api";
import { TExchangeInfoSymbol, TExchangeInfoSymbolsMap } from "./types/rest-api/exchange-info.type";
import { TPosition, TPositionsMap } from "./types/rest-api/position.type";

export const fakeDelay = async (seconds: number) => {
  await new Promise((resolve, _reject) => {
    setTimeout(() => {
      resolve("");
    }, seconds * 1000);
  });
};

export const symbolPricesToMap = (symbolPrices: TSymbolPrice[]) => {
  const pricesMap: TSymbolPricesMap = {};

  for (let symbolPrice of symbolPrices) {
    const symbol = symbolPrice.symbol;
    if (!(symbol in pricesMap)) {
      pricesMap[symbol] = symbolPrice;
    }
  }

  return pricesMap;
};

export const positionsToMap = (positions: TPosition[]) => {
  const positionsMap: TPositionsMap = {};

  for (let position of positions) {
    const symbol = position.symbol;
    if (!(symbol in positionsMap)) {
      positionsMap[symbol] = position;
    }
  }
  return positionsMap;
};

export function exchangeInfoSymbolsToMap(exchangeInfoSymbols: TExchangeInfoSymbol[]): TExchangeInfoSymbolsMap {
  let res: TExchangeInfoSymbolsMap = {};

  for (let exchangeInfoSymbol of exchangeInfoSymbols) {
    let key = exchangeInfoSymbol.symbol;
    if (!(key in res)) {
      res[key] = exchangeInfoSymbol;
    }
  }
  return res;
}

export const datasetItemsToSymbolPrices = (dtsetItems: IDatasetItemRecord[]): TSymbolPrices[] => {
  const grouped: { [key: number]: TSymbolPrice[] } = {};

  dtsetItems.forEach((item) => {
    const order = item.order;
    const symbolPrice: TSymbolPrice = {
      symbol: item.symbol,
      tickerPrice: item.ticker_price || null,
      marketPrice: item.market_price || null,
    };

    if (!grouped[order]) {
      grouped[order] = [];
    }
    grouped[order].push(symbolPrice);
  });

  return Object.keys(grouped)
    .map((order) => parseInt(order, 10))
    .sort((a, b) => a - b)
    .map((order) => grouped[order]);
};

////////////////////////////
export const numOfBuyOrders = (orders: TOrder[]) => {
  if (orders.length === 0) return 0;

  let count = 0;
  for (let order of orders) {
    if (order.side === "BUY") {
      count = count + 1;
    }
  }
  return count;
};
////////////////////////////
export const numOfSellOrders = (orders: TOrder[]) => {
  if (orders.length === 0) return 0;

  let count = 0;
  for (let order of orders) {
    if (order.side === "SELL") {
      count = count + 1;
    }
  }
  return count;
};

export function combineTickerAndMarketToPrices(symTickerPrices: TSymbolTickerPrice[], marTikerPrices: TSymbolMarketPrice[]): TSymbolPrice[] {
  const result: TSymbolPrice[] = [];

  const marketPriceMap = new Map<string, TSymbolMarketPrice>();
  marTikerPrices.forEach(marketPrice => {
    marketPriceMap.set(marketPrice.symbol, marketPrice);
  });

  symTickerPrices.forEach(tickerPrice => {
    const marketPrice = marketPriceMap.get(tickerPrice.symbol);
    const combinedPrice: TSymbolPrice = {
      symbol: tickerPrice.symbol,
      tickerPrice: tickerPrice.price,
      marketPrice: marketPrice ? marketPrice.markPrice : null
    };
    result.push(combinedPrice);
  });

  return result;
}

