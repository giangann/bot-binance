import { createHmac } from "crypto";
import { TTickerPriceStream } from "../types/binance-stream";
import { TMarkPriceStream } from "../types/binance-stream";
import {
  TSymbolPriceTicker,
  TSymbolPriceTickerWs,
} from "../types/symbol-price-ticker";
import { TSymbolMarkPriceWs } from "../types/symbol-mark-price";
import { TPosition } from "../types/position";
import { TOrder } from "../types/order";

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

export function ordersToMap(orders: TOrder[]): Record<string, TOrder> {
  let res: Record<string, TOrder> = {};

  // lastest order first
  const sortOrders = orders.sort((a, b) => b.time - a.time);
  for (let order of sortOrders) {
    let key = order.symbol;
    if (!(key in res)) {
      res[key] = order;
    }
  }
  return res;
}


export function validateAmount(amount: number) {
  if (amount >= 1) return Math.round(amount);
  if (amount < 1) return Math.round(amount * 1e3) / 1e3;
}