export type TSymbolMarkPriceWs = { symbol: string; markPrice: string };
export type TSymbolTickerPriceWs = { symbol: string; price: string };

export type TBinanceMarkPriceStreamToWs =
  | {
      event: "!markPrice@arr";
      data: TSymbolMarkPriceWs[];
    }
  | {
      event: "!ticker@arr";
      data: TSymbolTickerPriceWs[];
    };
