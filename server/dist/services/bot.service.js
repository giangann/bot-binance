"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BotService = void 0;
const bot_1 = require("../class/bot");
const bot = new bot_1.Bot();
class BotService {
    static async activateBot(botConfig) {
        await bot.activate(botConfig);
    }
    static async deactivateBot() {
        await bot.deactivate();
    }
    static getBotStatus() {
        return bot.getActiveStatus();
    }
    static async turnOnAutoActive() {
        await bot.startAutoActive();
    }
    static turnOffAutoActive() {
        bot.stopAutoActive();
    }
    static getAutoActiveStatus() {
        return bot.getAutoActiveStatus();
    }
    static updateStopPnlCache(chainId, pnl_to_stop) {
        bot.updatePnlToSop(chainId, pnl_to_stop);
    }
}
exports.BotService = BotService;
