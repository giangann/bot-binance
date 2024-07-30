import {
  currentMarketPriceKlineFromArray,
  maxMarketPriceKlineFromArray,
} from "../ultils/helper";
import { getMarketPriceKlines } from "../services/binance.service";
import loggerService from "../services/logger.service";

const autoActiveStart = () => {
  const autoActiveCheckInterval = setInterval(checkpoint, 5000);
};

const checkpoint = async () => {
  try {
    // get data, calculate price
    const klines = await getMarketPriceKlines();
    const maxPrice = maxMarketPriceKlineFromArray(klines);
    const currPrice = currentMarketPriceKlineFromArray(klines);

    console.log(maxPrice, currPrice)
  } catch (error: any) {
    loggerService.saveErrorAndClg(error);
  }
};

export { autoActiveStart };
