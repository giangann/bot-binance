import { createHmac } from "crypto";
import {
  ICoinPrice1AM,
  ICoinPrice1AMMap,
} from "../interfaces/coin-price-1am.interface";
import { IMarketOrderPieceEntity } from "../interfaces/market-order-piece.interface";
import {
  TBinanceError,
  TSymbolMarketPrice,
  TSymbolTickerPrice,
} from "../types/rest-api";
import {
  TExchangeInfoSymbol,
  TExchangeInfoSymbolsMap,
} from "../types/rest-api/exchange-info.type";
import { TPosition, TPositionsMap } from "../types/rest-api/position.type";
import { TSymbolMarketPriceKline } from "../types/rest-api/symbol-prices-kline.type";
import {
  TMarkPriceStream,
  TSymbolMarketPriceWs,
  TSymbolTickerPriceWs,
  TTickerPriceStream,
} from "../types/websocket";
import { TRateLimit } from "../types/websocket/ws-api-response.type";

export const fakeDelay = async (seconds: number) => {
  await new Promise((resolve, _reject) => {
    setTimeout(() => {
      resolve("");
    }, seconds * 1000);
  });
};
// Function to generate the signature
export function generateSignature(
  params: Record<string, any>,
  secret: string
): string {
  const sortedParams = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");
  return createHmac("sha256", secret).update(sortedParams).digest("hex");
}
export function paramsToQueryWithSignature(
  binance_api_secret: string,
  paramsObject: Record<string, unknown>
): string {
  let queryString = Object.keys(paramsObject)
    .map((key) => {
      return `${encodeURIComponent(key)}=${paramsObject[key]}`;
    })
    .join("&");

  const signature = createHmac("sha256", binance_api_secret)
    .update(queryString)
    .digest("hex");

  queryString += `&signature=${signature}`;

  return queryString;
}

// take TMarketStream or TTickerStream
// return TSymbolMarkPrice or TSYmbolTickerPrice
export function binanceStreamToSymbolPrice(
  streamResponse: TMarkPriceStream | TTickerPriceStream
) {
  let event = streamResponse.stream;

  // if tickerPrice then return (symbol, price)[]
  if (event === "!ticker@arr") {
    let stremDataArrayOfObj = streamResponse.data as TSymbolTickerPriceWs[]; // Narrow down the type
    let data = stremDataArrayOfObj.map((obj) => {
      return {
        symbol: obj.s,
        price: obj.c,
      };
    });
    return { event, data };
  }

  // if markPrice then return (symbol, markPrice)[]
  if (event === "!markPrice@arr") {
    let stremDataArrayOfObj = streamResponse.data as TSymbolMarketPriceWs[]; // Narrow down the type
    let data = stremDataArrayOfObj.map((obj) => {
      return {
        symbol: obj.s,
        markPrice: obj.p,
      };
    });
    return { event, data };
  }
}

export function validateAmount(amount: number, precision: number) {
  switch (precision) {
    case 0:
      return Math.round(amount);
      break;
    case 1:
      return Math.round(amount * 1e1) / 1e1;
      break;
    case 2:
      return Math.round(amount * 1e2) / 1e2;
      break;
    case 3:
      return Math.round(amount * 1e3) / 1e3;
      break;
    default:
      return Math.round(amount * 1e1) / 1e1;
      break;
  }
  // if (amount >= 1) return Math.round(amount);
  // if (amount < 1) return Math.round(amount * 1e2) / 1e2;
}

// arrray to map
export function symbolPricesToMap(
  symbolPrices: ICoinPrice1AM[]
): ICoinPrice1AMMap {
  let res: ICoinPrice1AMMap = {};

  for (let symbolPrice of symbolPrices) {
    const symbol = symbolPrice.symbol;
    if (!(symbol in res)) {
      res[symbol] = symbolPrice;
    }
  }

  return res;
}
export function exchangeInfoSymbolsToMap(
  exchangeInfoSymbols: TExchangeInfoSymbol[]
): TExchangeInfoSymbolsMap {
  let res: TExchangeInfoSymbolsMap = {};

  for (let exchangeInfoSymbol of exchangeInfoSymbols) {
    let key = exchangeInfoSymbol.symbol;
    if (!(key in res)) {
      res[key] = exchangeInfoSymbol;
    }
  }
  return res;
}
export function positionsToMap(positions: TPosition[]): TPositionsMap {
  let res: TPositionsMap = {};
  for (let position of positions) {
    let key = position.symbol;
    if (!(key in res)) {
      res[key] = position;
    }
  }
  return res;
}
export function symbolPriceTickersToMap<
  T extends Omit<TSymbolTickerPrice, "time">
>(symbolPriceTickers: T[]) {
  let res: Record<string, T> = {};

  for (let symbolPrice of symbolPriceTickers) {
    let key = symbolPrice.symbol;
    if (!(key in res)) {
      res[key] = symbolPrice;
    }
  }
  return res;
}
export function symbolPriceMarketsToMap(
  symbolPriceMarket: TSymbolMarketPrice[]
) {
  let res: Record<string, TSymbolMarketPrice> = {};

  for (let symbolPrice of symbolPriceMarket) {
    let key = symbolPrice.symbol;
    if (!(key in res)) {
      res[key] = symbolPrice;
    }
  }
  return res;
}
export function ableOrderSymbolsToMap(symbols: string[]) {
  let res: Record<string, boolean> = {};

  for (let symbol of symbols) {
    if (!(symbol in res)) {
      res[symbol] = true;
    }
  }
  return res;
}
export function orderPiecesToMap(
  orderPieces: IMarketOrderPieceEntity[]
): Record<string, IMarketOrderPieceEntity> {
  let res: Record<string, IMarketOrderPieceEntity> = {};

  for (const piece of orderPieces) {
    const orderId = piece.id;
    if (!(orderId in res)) {
      res[orderId] = piece;
    }
  }

  return res;
}

////////////////////////////////////
type TTickerAndMarkPrice = TSymbolMarketPrice & TSymbolTickerPrice;
export function mergeTicerPriceAndMarketPriceBySymbol(
  tickerPrices: TSymbolTickerPrice[],
  marketPrices: TSymbolMarketPrice[]
): TTickerAndMarkPrice[] {
  // Change array to map
  const tickerPricesMap = symbolPriceTickersToMap(tickerPrices);
  const marketPricesMap = symbolPriceMarketsToMap(marketPrices);

  const result: TTickerAndMarkPrice[] = [];

  // merge handle here

  // 1.
  // Loop through tickerPrices
  // Find the correspond marketPrice
  // Push to result the value of tickerPrice and marketPrice, remove that marketPrice from the marketPricesMap object

  // Loop through remain value of marketPricesMap object
  // Push to result the value of marketPrice and tickerPrice (null)

  // Loop through tickerPrices
  for (const tickerPrice of tickerPrices) {
    const key = tickerPrice.symbol;
    const marketPrice = marketPricesMap[key];
    if (marketPrice) {
      result.push({
        ...marketPrice,
        price: tickerPrice.price,
      });
      delete marketPricesMap[key]; // Remove matched marketPrice
    } else {
      result.push({
        symbol: tickerPrice.symbol,
        markPrice: null,
        indexPrice: "",
        estimatedSettlePrice: "",
        lastFundingRate: "",
        interestRate: "",
        nextFundingTime: 0,
        time: tickerPrice.time,
        price: tickerPrice.price,
      });
    }
  }

  // Loop through remaining values of marketPricesMap
  for (const key in marketPricesMap) {
    const marketPrice = marketPricesMap[key];
    result.push({
      ...marketPrice,
      price: null,
      time: marketPrice.time,
    });
  }

  return result;
}

export const filterPositionsNotZero = (positions: TPosition[]) => {
  return positions.filter((position) => parseFloat(position.positionAmt) !== 0);
};

export const rateLimitsArrayToString = (rateLimits: TRateLimit[]) => {
  let result = "";

  for (let rateLimit of rateLimits) {
    const { rateLimitType, interval, intervalNum, limit, count } = rateLimit;
    const partialString = `Type: ${rateLimitType}: ${count}/${limit} each ${intervalNum} ${interval}`;
    result += `${partialString} - `;
  }

  return result;
};

export const errorWsApiResponseToString = (error: TBinanceError) => {
  const { code, msg } = error;
  return `${code}: ${msg}`;
};

export const ableOrderSymbolsMapToArray = (
  ableOrderSymbolsMap: Record<string, boolean>
) => {
  const symbols = Object.entries(ableOrderSymbolsMap)
    .filter(([_symbol, isAble]) => isAble)
    .map(([symbol, _isAble]) => symbol);
  return symbols;
};

export const totalPnlFromPositionsMap = (positionsMap: TPositionsMap) => {
  let result = 0;
  const positionsMapEntries = Object.entries(positionsMap);

  for (const [_symbol, position] of positionsMapEntries) {
    const pnl = position?.unRealizedProfit;
    if (pnl) {
      const pnlNumber = parseFloat(pnl);
      result += pnlNumber;
    }
  }

  return result;
};

export const pnlOfSymbolFromPositionsMap = (
  positionsMap: TPositionsMap,
  symbol: string
) => {
  const symbolPosition = positionsMap[symbol];
  if (!symbolPosition) throw new Error(`${symbol}: no position found`);

  const positionPnl = symbolPosition?.unRealizedProfit;

  if (positionPnl === null || positionPnl === undefined)
    throw new Error(
      `${symbol}: position object dont have unRealizedProfit property`
    );

  const positionPnlNumber = parseFloat(positionPnl);
  return positionPnlNumber;
};

export function removeNullUndefinedProperties(
  obj: Record<string, unknown>
): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([_, value]) => value !== null && value !== undefined
    )
  );
}

export function maxMarketPriceKlineFromArray(
  marketPriceKlinesArray: TSymbolMarketPriceKline[]
) {
  let maxPrice = 0;
  for (let kline of marketPriceKlinesArray) {
    // get close price
    const closePrice = parseFloat(kline[4]);
    if (closePrice > maxPrice) maxPrice = closePrice;
  }

  return maxPrice;
}

export function currentMarketPriceKlineFromArray(
  marketPriceKlinesArray: TSymbolMarketPriceKline[]
) {
  const firstKlineEl = marketPriceKlinesArray[0];
  const lastKlineEl = marketPriceKlinesArray[marketPriceKlinesArray.length - 1];

  // compare timestamp
  // first kline element is the lastest
  const lastestKline =
    firstKlineEl[0] > lastKlineEl[0] ? firstKlineEl : lastKlineEl;

  // get close price of lastest kline
  const currentMarketPrice = parseFloat(lastestKline[4]);

  return currentMarketPrice;
}

export function numberOfBuyOrder(
  orderPieces: IMarketOrderPieceEntity[]
): number {
  if (!orderPieces) throw new Error("Order Pieces Not Yet Initialzied!");
  if (orderPieces.length === 0) return 0;

  let numberOfBuyOrder: number = 0;

  for (let piece of orderPieces) {
    if (piece.direction === "BUY") {
      numberOfBuyOrder += 1;
    }
  }

  return numberOfBuyOrder;
}
