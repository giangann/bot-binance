import { Bot } from "../class/bot";
import { TBotConfig } from "../types/bot/bot.types";

const bot = new Bot();

export class BotService {
  static async activateBot(botConfig: TBotConfig) {
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

  static updateStopPnlCache(chainId: number, pnl_to_stop: string) {
    bot.updatePnlToSop(chainId, pnl_to_stop);
  }
}
