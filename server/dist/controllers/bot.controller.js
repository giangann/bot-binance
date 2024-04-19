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
const active = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let params = {
            transaction_size_start: req.body.transaction_size,
            percent_to_buy: req.body.percent_to_buy,
            percent_to_sell: req.body.percent_to_sell,
        };
        // create new chain
        const currBalance = global.totalBalancesUSDT;
        const newOrderChain = yield market_order_chain_service_1.default.create(Object.assign({ price_start: "0.000", status: "open", total_balance_start: currBalance.toString() }, params));
        server_response_ultil_1.ServerResponse.response(res, newOrderChain);
    }
    catch (err) {
        console.log(err);
        server_response_ultil_1.ServerResponse.error(res, err.message);
    }
});
const quit = (req, res) => {
    try {
        bot_service_1.default.quit();
        server_response_ultil_1.ServerResponse.response(res, {});
    }
    catch (err) {
        server_response_ultil_1.ServerResponse.error(res, err.message);
    }
};
exports.default = { active, quit };
