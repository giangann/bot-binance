import { TWsApiResponse } from "./ws-api-response.type";

export type TNewOrderPlaceResult = {
  orderId: number;
  symbol: string;
  status: string;
  clientOrderId: string;
  price: string;
  avgPrice: string;
  origQty: string;
  executedQty: string;
  cumQty: string;
  cumQuote: string;
  timeInForce: string;
  type: string;
  reduceOnly: false;
  closePosition: false;
  side: string;
  positionSide: string;
  stopPrice: string;
  workingType: string;
  priceProtect: false;
  origType: string;
  priceMatch: string;
  selfTradePreventionMode: string;
  goodTillDate: number;
  updateTime: number;
};

export type TNewOrderPlaceResponse = TWsApiResponse<TNewOrderPlaceResult>;
