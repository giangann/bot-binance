export type TOrder = {
  symbol: string;
  quantity: number;
  side: "SELL" | "BUY";
};

export type TOrderExtraInfo = {
  price: string;
  percentChange: string;
  currentQty: string;
  isTakePrft?: boolean;
  isCutloss?: boolean;
  reason?: string;
};

export type TOrderInfo = TOrder & TOrderExtraInfo & { arbitraryId: string };

export type TOrderPiece = TOrder & TOrderExtraInfo;

export type TOrderPiecesMap = Record<string, TOrderPiece[]>;
export type TOrderInfoMap = Record<string, TOrderInfo>;

export type TSymbolPrice = {
  symbol: string;
  tickerPrice: string | null;
  marketPrice: string | null;
};

export type TSymbolPrices = TSymbolPrice[];

export type TSymbolPricesMap = Record<string, TSymbolPrice>;

export type TSymbolMarketPrice = {
  symbol: string;
  markPrice: string | null; // mark price => USE THIS VALUE
  indexPrice: string | null; // index price
  estimatedSettlePrice: string; // Estimated Settle Price, only useful in the last hour before the settlement starts.
  lastFundingRate: string; // This is the Latest funding rate
  nextFundingTime: number;
  interestRate: string;
  time: number;
};

export type TSymbolTickerPrice = {
  symbol: string;
  price: string | null;
  time: number;
};

export type TSymbolTickerPricesMap = Record<string, TSymbolTickerPrice>;
export type TSymbolMarketPricesMap = Record<string, TSymbolMarketPrice>;

export type TResponse<T> = T | TBinanceError;

export type TBinanceError = {
  code: number;
  msg: string;
};

export type TPosition = {
  symbol: string;
  positionAmt: string;
  unrealizedPnl: string;
};
export type TPositionsMap = Record<string, TPosition>;

export type TOpeningChain = {
  percent_to_first_buy: string;
  percent_to_buy: string;
  percent_to_sell: string;
  transaction_size_start: string;
  pnl_to_stop: string;
};

// cache - test
export type TState = {
  count: number;
  max: number;
};
