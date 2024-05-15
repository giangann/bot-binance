import { TPosition } from "../shared/types/position";
import {
  TSymbolMarkPriceWs,
  TSymbolTickerPriceWs,
} from "../shared/types/socket";
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
  percentPriceChange?: number;
  percentMarkPriceChange?: number;
};
export function mix(
  symbolAllPrices: ISymbolAllPriceDBRow[],
  symbolTickerPrices: ISymbolTickerPriceAPI[],
  symbolMarketPrices: ISymbolMarketPriceAPI[]
) {
  // return data[] of mixed with same symbol each row
  // data of each element from this:
  // data have this property: price(1AM ticker), mark_price(1AM), price(now ticker), mark_price(now)

  // let symbolAllPricesMap = symbolPriceToMap(symbolAllPrices);
  let symbolTickerPricesMap = symbolPriceToMap(symbolTickerPrices);
  let symbolMarkPriceMap = symbolPriceToMap(symbolMarketPrices);

  let dataArray: TData[] = [];

  for (let symbolPrice1AM of symbolAllPrices) {
    if (symbolPrice1AM.price && symbolPrice1AM.mark_price) {
      let symbol = symbolPrice1AM.symbol;
      let symbolTickerPrice = symbolTickerPricesMap[symbol];
      let symbolMarketPrice = symbolMarkPriceMap[symbol];
      if (symbolTickerPrice && symbolMarketPrice) {
        let data: TData = {
          symbol,
          price_1AM: symbolPrice1AM.price,
          mark_price_1AM: symbolPrice1AM.mark_price,
          price: symbolTickerPrice.price,
          mark_price: symbolMarketPrice.markPrice,
          percentMarkPriceChange: priceToPercent(
            symbolPrice1AM.mark_price,
            symbolMarketPrice.markPrice
          ),
          percentPriceChange: priceToPercent(
            symbolPrice1AM.price,
            symbolTickerPrice.price
          ),
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

export function priceToPercent(
  before: string | number,
  after: string | number
) {
  const p1 = parseFloat(before as unknown as string);
  const p2 = parseFloat(after as unknown as string);

  return (p2 / p1 - 1) * 100;
}

export function filterDataTable(
  keys: (keyof Pick<TData, "percentMarkPriceChange" | "percentPriceChange">)[],
  tableDatas: TData[]
) {
  let result: TData[] = [...tableDatas];

  for (let key of keys) {
    result = filterDataTableSingleKey(key, result);
  }
  return result;
}

export function filterDataTableSingleKey(
  key: keyof Pick<TData, "percentMarkPriceChange" | "percentPriceChange">,
  tableDatas: TData[]
) {
  const thresholdPercent = 5;

  return tableDatas.filter((data) => {
    const percentValue = parseFloat(data[key] as unknown as string);
    const pass = percentValue >= thresholdPercent;
    return pass;
  });
}

// export function sortDataTable(){}

export function sortDataTableSingleKey(
  keys: (keyof Pick<TData, "percentMarkPriceChange" | "percentPriceChange">)[],
  tableDatas: TData[]
) {
  if (keys.length === 1) {
    let key = keys[0];
    return tableDatas.sort((a, b) => {
      const aTickerPercentVal = parseFloat(a[key] as unknown as string);
      const bTickerPercentVal = parseFloat(b[key] as unknown as string);
      return bTickerPercentVal - aTickerPercentVal;
    });
  }
  if (keys.length === 2) {
    let key1 = keys[0];
    let key2 = keys[1];
    return tableDatas.sort((a, b) => {
      const aPercentValue1 = parseFloat(a[key1] as unknown as string);
      const bPercentValue1 = parseFloat(b[key1] as unknown as string);

      const aPercentValue2 = parseFloat(a[key2] as unknown as string);
      const bPercentValue2 = parseFloat(b[key2] as unknown as string);

      return bPercentValue1 - aPercentValue1 || bPercentValue2 - aPercentValue2;
    });
  }

  return tableDatas;
}

export function newMarkPrices(
  bStreamFowardMarkPrices: TSymbolMarkPriceWs[],
  markPrices: ISymbolMarketPriceAPI[]
) {
  const bStreamFowardMarkPricesMap = symbolPriceToMap(bStreamFowardMarkPrices);
  console.log("markprices", markPrices);
  let newMarkPricesArr = markPrices.map((markPrice) => {
    let symbolKey = markPrice.symbol;
    let newMarkPrice = bStreamFowardMarkPricesMap[symbolKey];

    return newMarkPrice
      ? {
          ...markPrice,
          markPrice: newMarkPrice.markPrice,
        }
      : markPrice;
  });

  return newMarkPricesArr;
}

export function newTickerPrices(
  bStreamFowardTickerPrices: TSymbolTickerPriceWs[],
  tickerPrices: ISymbolTickerPriceAPI[]
): ISymbolTickerPriceAPI[] {
  const bStreamFowardTickerPricesMap = symbolPriceToMap(
    bStreamFowardTickerPrices
  );

  let newTickerPricesArr = tickerPrices.map((tickerPrice) => {
    let symbolKey = tickerPrice.symbol;
    let newTickerPrice = bStreamFowardTickerPricesMap[symbolKey];
    if (newTickerPrice) {
      return {
        ...tickerPrice,
        price: newTickerPrice.price,
      };
    } else return tickerPrice;
  });

  return newTickerPricesArr;
}

export function sortValueInStringFormat(val1: string, val2: string) {
  let val1Float = parseFloat(val1);
  let val2Float = parseFloat(val2);

  return val1Float - val2Float;
}

export function sortPositionByPnl(positions: TPosition[]) {
  return positions.sort((a, b) =>
    sortValueInStringFormat(b.unRealizedProfit, a.unRealizedProfit)
  );
}
