"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BotTestController = void 0;
const bot_test_1 = require("../class/bot-test");
const server_response_ultil_1 = require("../ultils/server-response.ultil");
const botTest = new bot_test_1.BotTest();
class BotTestController {
    static async activateBotTest(req, res) {
        try {
            let botTestConfig;
            botTestConfig = {
                datasets_id: req.body?.datasets_id,
                transaction_size_start: req.body.transaction_size_start,
                percent_to_first_buy: req.body.percent_to_first_buy,
                percent_to_buy: req.body.percent_to_buy,
                percent_to_sell: req.body.percent_to_sell,
                pnl_to_stop: req.body.pnl_to_stop,
                max_pnl_start: req.body.max_pnl_start,
                max_pnl_threshold_to_quit: req.body.max_pnl_threshold_to_quit,
                symbol_max_pnl_start: req.body.symbol_max_pnl_start,
                symbol_max_pnl_threshold: req.body.symbol_max_pnl_threshold,
                symbol_pnl_to_cutloss: req.body.symbol_pnl_to_cutloss,
                price_type: req.body.price_type,
                status: "open",
                price_start: "0.000", // can't defined
                total_balance_start: "0.000", // can't defined
            };
            console.log(botTestConfig);
            await botTest.activate(botTestConfig);
            server_response_ultil_1.ServerResponse.response(res, { message: "Bot activated!" });
        }
        catch (error) {
            server_response_ultil_1.ServerResponse.error(res, error.message);
        }
    }
    static async deactivateBotTest(req, res) {
        try {
            await botTest.deactivate();
            server_response_ultil_1.ServerResponse.response(res, { message: "Bot deactivated!" });
        }
        catch (error) {
            server_response_ultil_1.ServerResponse.error(res, error.message);
        }
    }
    static getBotTestStatus(req, res) {
        const status = botTest.getActiveStatus();
        res.status(200).json({ isActive: status });
    }
}
exports.BotTestController = BotTestController;
