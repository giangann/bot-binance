"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const data_prepare_bot_1 = __importDefault(require("../loaders/data-prepare-bot"));
const bot_service_1 = __importDefault(require("../services/bot.service"));
const market_order_chain_service_1 = __importDefault(require("../services/market-order-chain.service"));
const server_response_ultil_1 = require("../ultils/server-response.ultil");
const active = async (req, res) => {
    try {
        let params = {
            transaction_size_start: req.body.transaction_size_start,
            percent_to_first_buy: req.body.percent_to_first_buy,
            percent_to_buy: req.body.percent_to_buy,
            percent_to_sell: req.body.percent_to_sell,
            pnl_to_stop: req.body.pnl_to_stop,
            max_pnl_start: req.body.max_pnl_start,
            max_pnl_threshold_to_quit: req.body.max_pnl_threshold_to_quit,
            price_type: req.body.price_type,
        };
        // create new chain
        const newOrderChain = await market_order_chain_service_1.default.create({
            status: "open",
            price_start: "0.000", // can't defined
            total_balance_start: "0.000", // can't defined
            ...params,
        });
        // update global data
        global.openingChain = newOrderChain;
        await (0, data_prepare_bot_1.default)();
        // call to service
        await bot_service_1.default.active();
        server_response_ultil_1.ServerResponse.response(res, newOrderChain);
    }
    catch (err) {
        console.log(err);
        server_response_ultil_1.ServerResponse.error(res, err.message);
    }
};
const quit = async (req, res) => {
    try {
        // call service
        const ordersPlacedToClosePositions = await bot_service_1.default.quit();
        server_response_ultil_1.ServerResponse.response(res, ordersPlacedToClosePositions);
    }
    catch (err) {
        server_response_ultil_1.ServerResponse.error(res, err.message);
    }
};
exports.default = { active, quit };
