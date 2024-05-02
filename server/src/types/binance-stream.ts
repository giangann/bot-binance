import { TSymbolMarkPriceWs } from "./symbol-mark-price";
import { TSymbolPriceTickerWs } from "./symbol-price-ticker";

export type TMarkPriceStream = {
  stream: "!markPrice@arr";
  data: TSymbolMarkPriceWs[];
};
export type TTickerPriceStream = {
  stream: "!ticker@arr";
  data: TSymbolPriceTickerWs[];
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
