import { TSymbolMarketPriceWs, TSymbolTickerPriceWs } from "../types/websocket";

export const updateSymbolTickerPricesNowMap = (
  symbolTickerPricesWs: TSymbolTickerPriceWs[]
) => {
  for (let symbolTickerPrice of symbolTickerPricesWs) {
    const symbol = symbolTickerPrice.s;
    const symbolTickerPriceNow = global.symbolTickerPricesNowMap[symbol];
    if (symbolTickerPriceNow) {
      symbolTickerPriceNow.price = symbolTickerPrice.c;
    }
  }
};

export const updateSymbolMarketPricesNowMap = (
  symbolMarketPricesWs: TSymbolMarketPriceWs[]
) => {
  for (let symbolMarketPrice of symbolMarketPricesWs) {
    const symbol = symbolMarketPrice.s;
    const symbolMarketPriceNow = global.symbolMarketPricesNowMap[symbol];
    if (symbolMarketPriceNow) {
      symbolMarketPriceNow.markPrice = symbolMarketPrice.p;
      symbolMarketPriceNow.indexPrice = symbolMarketPrice.i;
    }
  }
};
