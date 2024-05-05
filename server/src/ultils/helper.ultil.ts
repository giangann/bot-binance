import { createHmac } from "crypto";
import { TTickerPriceStream } from "../types/binance-stream";
import { TMarkPriceStream } from "../types/binance-stream";
import { TSymbolPriceTickerWs } from "../types/symbol-price-ticker";
import { TSymbolMarkPriceWs } from "../types/symbol-mark-price";

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
  const today1AM = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
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
