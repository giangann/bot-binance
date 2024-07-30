"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.autoActiveStart = void 0;
const helper_1 = require("../ultils/helper");
const binance_service_1 = require("../services/binance.service");
const logger_service_1 = __importDefault(require("../services/logger.service"));
const auto_active_config_service_1 = __importDefault(require("../services/auto-active-config.service"));
const market_order_chain_service_1 = __importDefault(require("../services/market-order-chain.service"));
const data_prepare_bot_1 = __importDefault(require("./data-prepare-bot"));
const bot_service_1 = __importDefault(require("../services/bot.service"));
const autoActiveStart = async () => {
    // query data from DB
    const autoActiveBotConfig = await auto_active_config_service_1.default.getOne();
    // update memory data
    global.autoActiveBotConfig = autoActiveBotConfig;
    // start interval, save interval to memory
    const autoActiveCheckInterval = setInterval(checkpoint, 5000);
    global.autoActiveCheckInterval = autoActiveCheckInterval;
    // logger to track
    const autoActiveStatus = autoActiveBotConfig.auto_active;
    const loggerMessage = `AutoActive: ${autoActiveStatus} when price decrease >= ${autoActiveBotConfig.auto_active_decrease_price}`;
    logger_service_1.default.saveDebug(loggerMessage);
};
exports.autoActiveStart = autoActiveStart;
const checkpoint = async () => {
    try {
        // skip if bot already running or auto active is turn off
        if (global.isBotActive)
            return;
        // get data, calculate price
        const klines = await (0, binance_service_1.getMarketPriceKlines)();
        const maxPrice = (0, helper_1.maxMarketPriceKlineFromArray)(klines);
        const currPrice = (0, helper_1.currentMarketPriceKlineFromArray)(klines);
        // emit price to client
        global.wsServerInstance.emit("auto-active-check", { maxPrice, currPrice });
        // still need to emit price to cient even status on or off
        if (autoActiveBotConfig.auto_active === "off")
            return;
        // decide able to active
        const decreasePrice = maxPrice - currPrice;
        const decreasePriceToActive = autoActiveBotConfig.auto_active_decrease_price;
        const decreasePriceToActiveNumber = parseFloat(decreasePriceToActive);
        const isAbleToActive = decreasePrice >= decreasePriceToActiveNumber;
        // if able then active
        if (isAbleToActive) {
            const activeReason = `BTCUSDT market price - Now: ${currPrice}, Max: ${maxPrice}`;
            // create new chain
            const newOrderChain = await market_order_chain_service_1.default.create({
                status: "open",
                price_start: "0.000", // can't defined
                total_balance_start: "0.000", // can't defined
                start_reason: activeReason,
                ...autoActiveBotConfig,
            });
            // update global data
            global.openingChain = newOrderChain;
            await (0, data_prepare_bot_1.default)();
            // call to service
            await bot_service_1.default.active();
            // emit event to notify to client
            global.wsServerInstance.emit("bot-active", activeReason);
            // save log
            logger_service_1.default.saveDebug(activeReason);
        }
    }
    catch (error) {
        logger_service_1.default.saveErrorAndClg(error);
    }
};
