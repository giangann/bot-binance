import { ISymbolAllPriceDBRow } from "../shared/types/symbol-all-price";
import { ISymbolMarketPriceAPI } from "../shared/types/symbol-mark-price";
import { ISymbolTickerPriceAPI } from "../shared/types/symbol-ticker-price";

// function mix coin from database with coin from ticker and market price
export type TData = {
  symbol: string;
  price_1AM: string;
  mark_price_1AM: string;
  price: string;
  mark_price: string;
};
export function mix(
  symbolAllPrices: ISymbolAllPriceDBRow[],
  symbolTickerPrices: ISymbolTickerPriceAPI[],
  symbolMarkPrice: ISymbolMarketPriceAPI[]
) {
  // return data[] of mixed with same symbol each row
  // data of each element from this:
  // data have this property: price(1AM ticker), mark_price(1AM), price(now ticker), mark_price(now)

  //   let symbolAllPricesMap = symbolPriceToMap(symbolAllPrices);
  let symbolTickerPricesMap = symbolPriceToMap(symbolTickerPrices);
  let symbolMarkPriceMap = symbolPriceToMap(symbolMarkPrice);

  let dataArray: TData[] = [];

  for (let symbolPrice of symbolAllPrices) {
    if (
      symbolPrice.price &&
      symbolPrice.mark_price 
    ) {
      let symbol = symbolPrice.symbol;
      let symbolTickerPrice = symbolTickerPricesMap[symbol];
      let symbolMarketPrice = symbolMarkPriceMap[symbol];
      if (symbolTickerPrice && symbolMarketPrice) {
        let data: TData = {
          symbol,
          price_1AM: symbolPrice.price,
          mark_price_1AM: symbolPrice.mark_price,
          price: symbolTickerPrice.price,
          mark_price: symbolMarketPrice.markPrice,
        };
        dataArray.push(data);
      }
    }
  }

  return dataArray;
}

// array object that have symbol properties to map with key is symbol and value is correspond element object
export function symbolPriceToMap<T extends { symbol: string }>(
  symbolPriceDatas: T[]
) {
  let res: Record<string, T> = {};

  for (let symbolPrice of symbolPriceDatas) {
    let symbolKey = symbolPrice.symbol;
    if (!(symbolKey in res)) {
      res[symbolKey] = symbolPrice;
    }
  }
  return res;
}

export function isObjValueNotNull(obj: Record<string, unknown>) {
  for (let key of Object.keys(obj)) {
    let objValue = obj[key];
    if (objValue === null) return false;
  }
  return true;
}

