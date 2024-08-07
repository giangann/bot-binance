import {
  currentMarketPriceKlineFromArray,
  maxMarketPriceKlineFromArray,
} from "../ultils/helper";
import { getMarketPriceKlines } from "../services/binance.service";
import loggerService from "../services/logger.service";
import autoActiveConfigService from "../services/auto-active-config.service";
import marketOrderChainService from "../services/market-order-chain.service";
import prepareDataBot from "./data-prepare-bot";
import botService from "../services/bot.service";

const autoActiveStart = async () => {
  try {
    // query data from DB
    const autoActiveBotConfig = await autoActiveConfigService.getOne();
    // update memory data
    global.autoActiveBotConfig = autoActiveBotConfig;

    // start interval, save interval to memory
    const autoActiveCheckInterval = setInterval(checkpoint, 5000);
    global.autoActiveCheckInterval = autoActiveCheckInterval;

    // logger to track
    const autoActiveStatus = autoActiveBotConfig.auto_active;
    const loggerMessage = `AutoActive: ${autoActiveStatus} when price decrease >= ${autoActiveBotConfig.auto_active_decrease_price}`;
    loggerService.saveDebug(loggerMessage);
  } catch (error: any) {
    loggerService.saveError(error);
  }
};

const checkpoint = async () => {
  try {
    // skip if bot already running or auto active is turn off
    loggerService.saveDebug(`global.isBotActive: ${global.isBotActive}`);
    if (global.isBotActive) return;

    // get data, calculate price
    const klines = await getMarketPriceKlines();
    const maxPrice = maxMarketPriceKlineFromArray(klines);
    const currPrice = currentMarketPriceKlineFromArray(klines);

    // emit price to client
    global.wsServerInstance.emit("auto-active-check", { maxPrice, currPrice });

    // still need to emit price to cient even status on or off
    if (autoActiveBotConfig.auto_active === "off") return;

    // decide able to active
    const decreasePrice = maxPrice - currPrice;
    const decreasePriceToActive =
      autoActiveBotConfig.auto_active_decrease_price;
    const decreasePriceToActiveNumber = parseFloat(decreasePriceToActive);
    const isAbleToActive = decreasePrice >= decreasePriceToActiveNumber;

    // if able then active
    if (isAbleToActive) {
      const activeReason = `BTCUSDT market price - Now: ${currPrice}, Max: ${maxPrice}`;

      // create new chain
      const newOrderChain = await marketOrderChainService.create({
        status: "open",
        price_start: "0.000", // can't defined
        total_balance_start: "0.000", // can't defined
        start_reason: activeReason,
        ...autoActiveBotConfig,
      });
      // update global data
      global.openingChain = newOrderChain;

      await prepareDataBot();

      // call to service
      await botService.active();

      // emit event to notify to client
      global.wsServerInstance.emit("bot-active", activeReason);

      // save log
      loggerService.saveDebug(activeReason);
    }
  } catch (error: any) {
    loggerService.saveErrorAndClg(error);
  }
};

export { autoActiveStart };
