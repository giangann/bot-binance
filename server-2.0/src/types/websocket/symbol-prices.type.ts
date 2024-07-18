export type TSymbolMarketPriceWs = {
  /** Event type */
  e: "markPriceUpdate";
  
  /** Event time */
  E: number;

  /** Symbol */
  s: string;

  /** Mark price */
  p: string;

  /** Index price */
  i: string;

  /** Estimated Settle Price, only useful in the last hour before the settlement starts */
  P: string;

  /** Funding rate */
  r: string;

  /** Next funding time */
  T: number;
};

export type TSymbolTickerPriceWs = {
  /** Event type */
  e: "24hrTicker";

  /** Event time */
  E: number;

  /** Symbol */
  s: string;

  /** Price change */
  p: string;

  /** Price change percent */
  P: string;

  /** Weighted average price */
  w: string;

  /** Last price */
  c: string;

  /** Last quantity */
  Q: string;

  /** Open price */
  o: string;

  /** High price */
  h: string;

  /** Low price */
  l: string;

  /** Total traded base asset volume */
  v: string;

  /** Total traded quote asset volume */
  q: string;

  /** Statistics open time */
  O: number;

  /** Statistics close time */
  C: number;

  /** First trade ID */
  F: number;

  /** Last trade Id */
  L: number;

  /** Total number of trades */
  n: number;
};
