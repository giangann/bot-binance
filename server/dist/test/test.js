"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_config_1 = require("../loaders/logger.config");
const test = async () => {
    try {
        makeOrder();
        makeError();
        console.log("success");
    }
    catch (err) {
        logger_config_1.logger.error(err.message);
    }
};
const makeOrder = () => {
    logger_config_1.logger.debug('CHAIN_ID: 197 ORDER_ID: 1876441095   || SELL 0.60  SSVUSDT              IS_FIRST_ORDER: false, PREV_PRICE: 40.03800    , CURR_PRICE: 39.22800    , PERCENT_CHANGE: -2.02%  , POSITION_AMT: 0.6    , AMOUNT: 23.537    , QUANTITY_PRECISION: 2 , TIMESTAMP: 2024-06-22 20:50:13');
};
const makeError = () => {
    throw new Error("fake error");
};
// test();
