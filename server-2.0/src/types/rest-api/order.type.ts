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