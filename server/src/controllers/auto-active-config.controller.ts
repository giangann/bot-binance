import { BotService } from "../services/bot.service";
import IController from "../interfaces/IController";
import { IAutoActiveConfigUpdateOne } from "../interfaces/auto-active-config.interface";
import autoActiveConfigService from "../services/auto-active-config.service";
import { removeNullUndefinedProperties } from "../ultils/helper";
import { ServerResponse } from "../ultils/server-response.ultil";

const getOne: IController = async (req, res) => {
  try {
    const configData = await autoActiveConfigService.getOne();
    ServerResponse.response(res, configData);
  } catch (error: any) {
    ServerResponse.error(res, error.message);
  }
};

const updateOne: IController = async (req, res) => {
  try {
    //  check whether or not auto-active is on
    const isAutoActiveOn = BotService.getAutoActiveStatus();
    if (isAutoActiveOn) throw new Error("BOT_PROD: hãy tắt auto-active trước khi update!");

    // get params
    const params: IAutoActiveConfigUpdateOne = {
      auto_active_decrease_price: req.body?.auto_active_decrease_price,
      max_pnl_start: req.body?.max_pnl_start,
      max_pnl_threshold_to_quit: req.body?.max_pnl_threshold_to_quit,
      symbol_max_pnl_start: req.body?.symbol_max_pnl_start,
      symbol_max_pnl_threshold: req.body?.symbol_max_pnl_threshold,
      symbol_pnl_to_cutloss: req.body?.symbol_pnl_to_cutloss,
      percent_to_buy: req.body?.percent_to_buy,
      percent_to_first_buy: req.body?.percent_to_first_buy,
      percent_to_sell: req.body?.percent_to_sell,
      pnl_to_stop: req.body?.pnl_to_stop,
      price_type: req.body?.price_type,
      transaction_size_start: req.body?.transaction_size_start,
      auto_active: req.body?.auto_active,
    };
    const validParams = removeNullUndefinedProperties(params);

    // update database
    const updatedRecord = await autoActiveConfigService.updateOne(validParams);

    ServerResponse.response(res, updatedRecord);
  } catch (error: any) {
    ServerResponse.error(res, error.message);
  }
};

export default { getOne, updateOne };
