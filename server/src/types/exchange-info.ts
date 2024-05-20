export type TExchangeInfoSymbol = {
  symbol: string;
  pair: string;
  contractType: string;
  deliveryDate: number;
  onboardDate: number;
  status: string;
  maintMarginPercent: string;
  requiredMarginPercent: string;
  baseAsset: string;
  quoteAsset: string;
  marginAsset: string;
  pricePrecision: number; //
  quantityPrecision: number; //
  baseAssetPrecision: number;
  quotePrecision: number;
  underlyingType: string;
  underlyingSubType: [];
  settlePlan: number;
  triggerProtect: string;
  liquidationFee: string;
  marketTakeBound: string;
  maxMoveOrderLimit: number;
  filters: [
    {
      filterType: string;
      maxPrice: string;
      minPrice: string;
      tickSize: string;
    },
    {
      stepSize: string;
      minQty: string;
      maxQty: string;
      filterType: string;
    },
    {
      maxQty: string;
      stepSize: string;
      minQty: string;
      filterType: string;
    },
    {
      filterType: string;
      limit: number;
    },
    {
      filterType: string;
      limit: number;
    },
    {
      filterType: string;
      notional: string;
    },
    {
      filterType: string;
      multiplierUp: string;
      multiplierDown: string;
      multiplierDecimal: string;
    }
  ];
  orderTypes: [string, string, string, string, string, string, string];
  timeInForce: [string];
};

export type TExchangeInfo = {
  symbols: TExchangeInfoSymbol[];
} & Record<string, unknown>;

type Person = {
  childhood: {
    nickname: string;
    relax: string;
  };
} & Record<string, unknown>;
