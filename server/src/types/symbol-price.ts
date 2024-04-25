export type TSymbolPrice = {
  time: number;
  price: string;
  symbol: string;
};

export type TSymbolPriceMap = {
  [key: string]: TSymbolPrice;
};
