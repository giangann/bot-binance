export type TSymbolMarketPrice = {
  symbol: string;
  markPrice: string; // mark price => USE THIS VALUE
  indexPrice: string; // index price
  estimatedSettlePrice: string; // Estimated Settle Price, only useful in the last hour before the settlement starts.
  lastFundingRate: string; // This is the Latest funding rate
  nextFundingTime: number;
  interestRate: string;
  time: number;
};

export type TSymbolTickerPrice = {
  symbol: string;
  price: string;
  time: number;
};

export type TSymbolTickerPricesMap = Record<string, TSymbolTickerPrice>;
export type TSymbolMarketPricesMap = Record<string, TSymbolMarketPrice>;
