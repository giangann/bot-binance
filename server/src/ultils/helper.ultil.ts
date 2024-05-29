import { createHmac } from "crypto";
import { IMarketOrderPieceRecord } from "market-order-piece.interface";
import { TMarkPriceStream, TTickerPriceStream } from "../types/binance-stream";
import { TExchangeInfoSymbol } from "../types/exchange-info";
import {
  TNewOrder,
  TResponSuccess,
  TResponse,
  TResponseFailure
} from "../types/order";
import { TPosition } from "../types/position";
import { TSymbolMarkPriceWs } from "../types/symbol-mark-price";
import {
  TSymbolPriceTicker,
  TSymbolPriceTickerWs,
} from "../types/symbol-price-ticker";

export function priceToPercent(p1: number, p2: number) {
  return (p2 / p1 - 1) * 100;
}
export function compareDate(date1: string, date2: string) {
  if (date1 >= date2) return -1;
  else return 1;
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

export function queryStringToSignature(
  queryString: string,
  binance_api_secret: string
) {
  const hmac = createHmac("sha256", binance_api_secret);
  hmac.update(queryString);
  const signature = hmac.digest("hex");

  return signature;
}
export function getTimestampOfToday1AM() {
  const now = new Date(); // Get current date and time

  // Check if the current time is between midnight and 1 AM
  if (
    now.getHours() === 0 &&
    now.getMinutes() >= 0 &&
    now.getMinutes() <= 59 &&
    now.getSeconds() >= 1 &&
    now.getSeconds() <= 59
  ) {
    // If it is, get yesterday's date
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);

    // Set time to yesterday 1 AM
    yesterday.setHours(1, 0, 0, 0);

    return yesterday.getTime(); // Get timestamp in milliseconds for yesterday 1 AM
  } else {
    // If not, get today's date and set time to 1 AM
    const today1AM = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      1,
      0,
      0,
      0
    );
    return today1AM.getTime(); // Get timestamp in milliseconds for today 1 AM
  }
}

export function getTimestampOfYesterday1AM() {
  const now = new Date(); // Get current date and time
  const today1AM = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - 1,
    1,
    0,
    0,
    0
  ); // Set time to 1 AM
  return today1AM.getTime(); // Get timestamp in milliseconds
}
// take TMarketStream or TTickerStream
// return TSymbolMarkPrice or TSYmbolTickerPrice
export function binanceStreamToSymbolPrice(
  streamResponse: TMarkPriceStream | TTickerPriceStream
) {
  let event = streamResponse.stream;

  // if tickerPrice then return (symbol, price)[]
  if (event === "!ticker@arr") {
    let stremDataArrayOfObj = streamResponse.data as TSymbolPriceTickerWs[]; // Narrow down the type
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
    let stremDataArrayOfObj = streamResponse.data as TSymbolMarkPriceWs[]; // Narrow down the type
    let data = stremDataArrayOfObj.map((obj) => {
      return {
        symbol: obj.s,
        markPrice: obj.p,
      };
    });
    return { event, data };
  }
}

export function exchangeInfoSymbolsToMap(
  exchangeInfoSymbols: TExchangeInfoSymbol[]
): Record<string, TExchangeInfoSymbol> {
  let res: Record<string, TExchangeInfoSymbol> = {};

  for (let exchangeInfoSymbol of exchangeInfoSymbols) {
    let key = exchangeInfoSymbol.symbol;
    if (!(key in res)) {
      res[key] = exchangeInfoSymbol;
    }
  }
  return res;
}

export function symbolPriceTickersToMap<
  T extends Omit<TSymbolPriceTicker, "time">
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

export function positionsToMap(positions: TPosition[]) {
  let res: Record<string, TPosition> = {};
  for (let position of positions) {
    let key = position.symbol;
    if (!(key in res)) {
      res[key] = position;
    }
  }
  return res;
}

export function orderPiecesToMap(orderPieces: IMarketOrderPieceRecord[]) {
  let res: Record<string, IMarketOrderPieceRecord> = {};

  // lastest order first
  const sortOrders = orderPieces.sort((a, b) =>
    compareDate(a.createdAt, b.createdAt)
  );
  for (let order of sortOrders) {
    let key = order.symbol;
    if (!(key in res)) {
      res[key] = order;
    }
  }
  return res;
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

export function isSuccess(status: number) {
  const successStatuss = [200, 201];
  return successStatuss.includes(status) ? true : false;
}

export function filterAblePosition(positions: TPosition[]) {
  return positions.filter((pos) => parseFloat(pos.positionAmt) > 0);
}

export function filterSuccessOrder(newOrders: TResponse<TNewOrder>[]) {
  return newOrders.filter(
    (newOrder) => newOrder.success === true
  ) as TResponSuccess<TNewOrder>[];
}
export function filterFailOrder(newOrders: TResponse<TNewOrder>[]) {
  return newOrders.filter(
    (newOrder) => newOrder.success === false
  ) as TResponseFailure[];
}

// make stackTrace of error shorter
export function stackTraceShorter(trace: string): string {
  const traceArr = trace.split("\n    ");

  const firstTrace = traceArr[traceArr.length - 1];
  const secondTrace = traceArr[traceArr.length - 2];
  const thirdTrace = traceArr[traceArr.length - 3];

  return `${firstTrace}  -  ${secondTrace}  -  ${thirdTrace}`;
}
