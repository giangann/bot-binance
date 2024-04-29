export type TSymbolMarkPrice = {
  symbol: string;
  markPrice: string;
  indexPrice: string;
  estimatedSettlePrice: string;
  lastFundingRate: string;
  interestRate: string;
  nextFundingTime: number;
  time: number;
};

export type TSymbolMarkPriceWs = {
  e: "markPriceUpdate"; // Event type
  E: number; // Event time
  s: string; // Symbol
  p: string; // Mark price
  i: string; // Index price
  P: string; // Estimated Settle Price, only useful in the last hour before the settlement starts
  r: string; // Funding rate
  T: number; // Next funding time
};
