"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BotController = void 0;
const server_response_ultil_1 = require("../ultils/server-response.ultil");
const bot_service_1 = require("../services/bot.service");
class BotController {
    static async activateBot(req, res) {
        try {
            let botConfig;
            botConfig = {
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
            await bot_service_1.BotService.activateBot(botConfig);
            server_response_ultil_1.ServerResponse.response(res, { message: "Bot activated!" });
        }
        catch (error) {
            server_response_ultil_1.ServerResponse.error(res, error.message);
        }
    }
    static async deactivateBot(req, res) {
        try {
            await bot_service_1.BotService.deactivateBot();
            server_response_ultil_1.ServerResponse.response(res, { message: "Bot deactivated!" });
        }
        catch (error) {
            server_response_ultil_1.ServerResponse.error(res, error.message);
        }
    }
    static getBotStatus(req, res) {
        try {
            const status = bot_service_1.BotService.getBotStatus();
            server_response_ultil_1.ServerResponse.response(res, { isActive: status });
        }
        catch (error) {
            server_response_ultil_1.ServerResponse.error(res, error.message);
        }
    }
    static async turnOnAutoActive(req, res) {
        try {
            await bot_service_1.BotService.turnOnAutoActive();
            server_response_ultil_1.ServerResponse.response(res, { message: "Auto-active now is turned on!" });
        }
        catch (error) {
            server_response_ultil_1.ServerResponse.error(res, error.message);
        }
    }
    static async turnOffAutoActive(req, res) {
        try {
            bot_service_1.BotService.turnOffAutoActive();
            server_response_ultil_1.ServerResponse.response(res, { message: "Auto-active now is turned off!" });
        }
        catch (error) {
            server_response_ultil_1.ServerResponse.error(res, error.message);
        }
    }
    static getAutoActiveStatus(req, res) {
        try {
            const status = bot_service_1.BotService.getAutoActiveStatus();
            server_response_ultil_1.ServerResponse.response(res, { isAutoActiveOn: status });
        }
        catch (error) {
            server_response_ultil_1.ServerResponse.error(res, error.message);
        }
    }
}
exports.BotController = BotController;
