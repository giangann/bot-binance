import {
  TSymbolMarketPriceWs,
  TSymbolTickerPriceWs,
} from "./symbol-prices.type";

export type TMarkPriceStream = {
  stream: "!markPrice@arr";
  data: TSymbolMarketPriceWs[];
};
export type TTickerPriceStream = {
  stream: "!ticker@arr";
  data: TSymbolTickerPriceWs[];
};

type TSymbolMarkPrice = { symbol: string; markPrice: string };
type TSymbolTickerPrice = { symbol: string; price: string };

export type TBinanceMarkPriceStreamToWs =
  | {
      event: "!markPrice@arr";
      data: TSymbolMarkPrice[];
    }
  | {
      event: "!ticker@arr";
      data: TSymbolTickerPrice[];
    };
