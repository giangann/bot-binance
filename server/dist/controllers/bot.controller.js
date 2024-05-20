"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bot_service_1 = __importDefault(require("../services/bot.service"));
const market_order_chain_service_1 = __importDefault(require("../services/market-order-chain.service"));
const server_response_ultil_1 = require("../ultils/server-response.ultil");
const binance_service_1 = __importDefault(require("../services/binance.service"));
const logger_config_1 = require("../loaders/logger.config");
const active = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let params = {
            transaction_size_start: req.body.transaction_size,
            percent_to_first_buy: req.body.percent_to_first_buy,
            percent_to_buy: req.body.percent_to_buy,
            percent_to_sell: req.body.percent_to_sell,
        };
        // create new chain
        const newOrderChain = yield market_order_chain_service_1.default.create(Object.assign({ status: "open", price_start: "0.000", total_balance_start: "0.000" }, params));
        server_response_ultil_1.ServerResponse.response(res, newOrderChain);
    }
    catch (err) {
        console.log(err);
        server_response_ultil_1.ServerResponse.error(res, err.message);
    }
});
const quit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const positions = yield binance_service_1.default.getPositions();
        // make promises and fullfilled
        const orderPromises = positions.map((position) => {
            let symbol = position.symbol;
            let quantity = parseFloat(position.positionAmt);
            let side = "SELL";
            return binance_service_1.default.createMarketOrder(symbol, side, quantity);
        });
        const orderResult = yield Promise.all(orderPromises);
        // log and error
        let numOfSuccess = 0;
        let numOfFailure = 0;
        for (let res of orderResult) {
            if (res.success === true) {
                const { orderId, side, origQty, symbol } = res.data;
                numOfSuccess += 1;
                // log order info
                const msg = `orderId: ${orderId}, symbol: ${symbol}, quantity: ${origQty}, side: ${side}`;
                logger_config_1.logger.info(msg);
            }
            else {
                numOfFailure += 1;
                // log error message
                const { error: { code, msg }, payload, } = res;
                const { symbol, quantity, side } = payload;
                const logMsg = `${code} - ${msg}, symbol: ${symbol}, quantity: ${quantity}, side: ${side}`;
                logger_config_1.logger.info(logMsg);
            }
        }
        const data = { numOfSuccess, numOfFailure };
        yield bot_service_1.default.quit();
        server_response_ultil_1.ServerResponse.response(res, data);
    }
    catch (err) {
        server_response_ultil_1.ServerResponse.error(res, err.message);
    }
});
exports.default = { active, quit };
