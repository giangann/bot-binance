export type TSymbolPrice = {
  timestamp: string;
  price: number;
  symbol: string;
};

export type TSymbolPriceMap = {
  [key: string]: TSymbolPrice;
};
