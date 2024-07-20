import { TSymbolTickerPriceWs } from "../types/websocket";

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
