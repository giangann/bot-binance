import loggerService from "../../services/logger.service";
import { TSymbolTickerPriceWs } from "../../types/websocket";
import { updateSymbolTickerPricesNowMap } from "../memory.ultil";
////////////////////////////////////////////////////
// handle when ticker price update
export const tickerPricesUpdateEvHandlerWs = (msg: any): void => {
  try {
    if (global.isBotActive) {
      // evaluate and place order if bot is active
      const msgString = msg.toString();
      const symbolTickerPrices: TSymbolTickerPriceWs[] = JSON.parse(msgString);

      // update memory
      updateSymbolTickerPricesNowMap(symbolTickerPrices);
    }
  } catch (err) {
    loggerService.saveError(err);
  }
};
