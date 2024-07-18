export type TOrderParam = {
  symbol: string;
  direction: "BUY" | "SELL";
  quantity: number;
};

export type TOrderReason = {
  isFirstOrder: boolean;
  currPrice: number;
  prevPrice: number;
  percentChange: number;
  positionAmt: number;
};

export type TOrderMoreInfo = {
  amount: number; // size calculated by base asset (USD)
  quantityPrecision: number;
};

export type TOrderInfo = TOrderParam & TOrderReason & TOrderMoreInfo;

export type TOrderInfosMap = Record<string, TOrderInfo>;
