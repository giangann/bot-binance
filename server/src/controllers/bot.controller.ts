import IController from "IController";
import botService from "../services/bot.service";
import marketOrderChainService from "../services/market-order-chain.service";
import { ServerResponse } from "../ultils/server-response.ultil";

const active: IController = async (req, res) => {
  try {
    let params = {
      transaction_size_start: req.body.transaction_size,
      percent_to_buy: req.body.percent_to_buy,
      percent_to_sell: req.body.percent_to_sell,
    };

    // create new chain
    const newOrderChain = await marketOrderChainService.create({
      status: "open",
      price_start: "0.000", // can't defined
      total_balance_start: "0.000", // can't defined
      ...params,
    });

    ServerResponse.response(res, newOrderChain);
  } catch (err) {
    console.log(err);
    ServerResponse.error(res, err.message);
  }
};

const quit: IController = (req, res) => {
  try {
    botService.quit();
    ServerResponse.response(res, {});
  } catch (err) {
    ServerResponse.error(res, err.message);
  }
};
export default { active, quit };
