export type TOrder = {
  orderId: number;
  symbol: string;
  status: string;
  clientOrderId: string;
  price: string;
  avgPrice: string;
  origQty: string;
  executedQty: string;
  cumQuote: string;
  timeInForce: string;
  type: string;
  reduceOnly: boolean;
  closePosition: boolean;
  side: string;
  positionSide: string;
  stopPrice: string;
  workingType: string;
  priceMatch: string;
  selfTradePreventionMode: string;
  goodTillDate: number;
  priceProtect: boolean;
  origType: string;
  time: number;
  updateTime: number;
};
export type TNewOrder = {
  clientOrderId: string;
  cumQty: string;
  cumQuote: string;
  executedQty: string;
  orderId: number;
  avgPrice: string;
  origQty: string;
  price: string;
  reduceOnly: boolean;
  side: string;
  positionSide: string;
  status: string;
  stopPrice: string; // please ignore when order type is TRAILING_STOP_MARKET
  closePosition: boolean; // if Close-All
  symbol: string;
  timeInForce: string;
  type: string;
  origType: string;
  activatePrice: string; // activation price, only return with TRAILING_STOP_MARKET order
  priceRate: string; // callback rate, only return with TRAILING_STOP_MARKET order
  updateTime: number;
  workingType: string;
  priceProtect: boolean; // if conditional order trigger is protected
  priceMatch: string; //price match mode
  selfTradePreventionMode: string; //self trading preventation mode
  goodTillDate: number; //order pre-set auot cancel time for TIF GTD order
};
// ------------Example TOrder (of order history)---------------
// {
//   "orderId": 4030330879,
//   "symbol": "BTCUSDT",
//   "status": "FILLED",
//   "clientOrderId": "wOGcvzfnddD7o3cmpD9cb6",
//   "price": "0",
//   "avgPrice": "62179.40000",
//   "origQty": "0.002",
//   "executedQty": "0.002",
//   "cumQuote": "124.35880",
//   "timeInForce": "GTC",
//   "type": "MARKET",
//   "reduceOnly": false,
//   "closePosition": false,
//   "side": "BUY",
//   "positionSide": "BOTH",
//   "stopPrice": "0",
//   "workingType": "CONTRACT_PRICE",
//   "priceMatch": "NONE",
//   "selfTradePreventionMode": "NONE",
//   "goodTillDate": 0,
//   "priceProtect": false,
//   "origType": "MARKET",
//   "time": 1714795709283,
//   "updateTime": 1714795709283
// },
// ------------Example TNewOrder---------------
// {
//   "orderId": 4033591991,
//   "symbol": "BTCUSDT",
//   "status": "NEW",
//   "clientOrderId": "8yNeQG8LllRsNwcjkW1SB8",
//   "price": "0.00",
//   "avgPrice": "0.00",
//   "origQty": "0.100",
//   "executedQty": "0.000",
//   "cumQty": "0.000",
//   "cumQuote": "0.00000",
//   "timeInForce": "GTC",
//   "type": "MARKET",
//   "reduceOnly": false,
//   "closePosition": false,
//   "side": "BUY",
//   "positionSide": "BOTH",
//   "stopPrice": "0.00",
//   "workingType": "CONTRACT_PRICE",
//   "priceProtect": false,
//   "origType": "MARKET",
//   "priceMatch": "NONE",
//   "selfTradePreventionMode": "NONE",
//   "goodTillDate": 0,
//   "updateTime": 1715242697664
// }

export type TCreateOrderErr = {
  code: number;
  msg: string;
};

export type TResponSuccess<T> = {
  success: true;
  data: T;
};

export type TResponseFailure = {
  success: false;
  error: TCreateOrderErr;
  payload?: Record<string, unknown>;
};
export type TResponse<T> = TResponSuccess<T> | TResponseFailure;
