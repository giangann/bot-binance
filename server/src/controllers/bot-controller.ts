import { Request, Response } from "express";
import { ServerResponse } from "../ultils/server-response.ultil";
import { TBotConfig } from "../types/bot/bot.types";
import { BotService } from "../services/bot.service";

export class BotController {
  static async activateBot(req: Request, res: Response) {
    try {
      let botConfig: TBotConfig;
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

      await BotService.activateBot(botConfig);

      ServerResponse.response(res, { message: "Bot activated!" });
    } catch (error) {
      ServerResponse.error(res, error.message);
    }
  }

  static async deactivateBot(req: Request, res: Response) {
    try {
      await BotService.deactivateBot();
      ServerResponse.response(res, { message: "Bot deactivated!" });
    } catch (error) {
      ServerResponse.error(res, error.message);
    }
  }

  static getBotStatus(req: Request, res: Response) {
    try {
      const status = BotService.getBotStatus();
      ServerResponse.response(res, { isActive: status });
    } catch (error) {
      ServerResponse.error(res, error.message);
    }
  }

  static async turnOnAutoActive(req: Request, res: Response) {
    try {
      await BotService.turnOnAutoActive();

      ServerResponse.response(res, { message: "Auto-active now is turned on!" });
    } catch (error) {
      ServerResponse.error(res, error.message);
    }
  }

  static async turnOffAutoActive(req: Request, res: Response) {
    try {
      BotService.turnOffAutoActive();

      ServerResponse.response(res, { message: "Auto-active now is turned off!" });
    } catch (error) {
      ServerResponse.error(res, error.message);
    }
  }

  static getAutoActiveStatus(req: Request, res: Response) {
    try {
      const status = BotService.getAutoActiveStatus();
      ServerResponse.response(res, { isAutoActiveOn: status });
    } catch (error) {
      ServerResponse.error(res, error.message);
    }
  }
}
