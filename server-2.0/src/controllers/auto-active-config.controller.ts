import { ServerResponse } from "../ultils/server-response.ultil";
import IController from "../interfaces/IController";
import autoActiveConfigService from "../services/auto-active-config.service";
import { IAutoActiveConfigUpdate } from "../interfaces/auto-active-config.interface";
import { removeNullUndefinedProperties } from "../ultils/helper";

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
    const params: Omit<IAutoActiveConfigUpdate, "id"> = {
      auto_active_decrease_price: req.body?.auto_active_decrease_price,
      max_pnl_start: req.body?.max_pnl_start,
      max_pnl_threshold_to_quit: req.body?.max_pnl_threshold_to_quit,
      percent_to_buy: req.body?.percent_to_buy,
      percent_to_first_buy: req.body?.percent_to_first_buy,
      percent_to_sell: req.body?.percent_to_sell,
      pnl_to_stop: req.body?.pnl_to_stop,
      price_type: req.body?.price_type,
      transaction_size_start: req.body?.transaction_size_start,
    };
    const validParams = removeNullUndefinedProperties(params);

    // update database
    const updatedRecord = await autoActiveConfigService.updateOne(validParams);
    // update memory
    global.autoActiveBotConfig = {
      ...global.autoActiveBotConfig,
      ...validParams,
    };

    ServerResponse.response(res, updatedRecord);
  } catch (error: any) {
    ServerResponse.error(res, error.message);
  }
};

export default { getOne, updateOne };
