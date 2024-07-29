import loggerService from "../../services/logger.service";
import { TSymbolMarketPriceWs } from "../../types/websocket";
import {
  updateSymbolMarketPricesNowMap,
  updateSymbolTickerPricesNowMap,
} from "../memory.ultil";
////////////////////////////////////////////////////
// handle when ticker price update
export const tickerPricesUpdateEvHandlerWs = (msg: any): void => {
  try {
    if (global.isBotActive) {
      const openingChain = global.openingChain;
      if (openingChain.price_type === "market") {
        // evaluate and place order if bot is active
        const msgString = msg.toString();
        const symbolMarketPrices: TSymbolMarketPriceWs[] =
          JSON.parse(msgString);

        // update memory
        updateSymbolMarketPricesNowMap(symbolMarketPrices);
      }
    }
  } catch (err) {
    loggerService.saveError(err);
  }
};
