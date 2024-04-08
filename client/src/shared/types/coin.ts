export interface ICoinPrice {
  symbol: string;
  price: string;
  time?: number;
}

export interface ICoinPriceChange extends ICoinPrice {
  percentChange: string;
}

export type TCoinPriceMap = { [key: string]: ICoinPrice };
