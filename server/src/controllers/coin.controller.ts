import IController from "IController";
import { ServerResponse } from "../ultils/server-response.ultil";
import coinService from "../services/coin.service";
import binanceService from "../services/binance.service";

const getNowClosePrices: IController = async (req, res) => {
  try {
    const currSymbols = await coinService.getAllSymbolsDB();
    const currPrices = await binanceService.getSymbolsClosePrice(currSymbols);
    ServerResponse.response(res, currPrices);
  } catch (err) {
    console.log("err", err);
    ServerResponse.error(res, err.message);
  }
};

export default { getNowClosePrices };
