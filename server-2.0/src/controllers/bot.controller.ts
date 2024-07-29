import prepareDataBot from "../loaders/data-prepare-bot";
import IController from "../interfaces/IController";
import botService from "../services/bot.service";
import marketOrderChainService from "../services/market-order-chain.service";
import { ServerResponse } from "../ultils/server-response.ultil";
import { activeBot, quitBot } from "../mock/bot-control";

const active: IController = async (req, res) => {
  try {
    let params = {
      transaction_size_start: req.body.transaction_size,
      percent_to_first_buy: req.body.percent_to_first_buy,
      percent_to_buy: req.body.percent_to_buy,
      percent_to_sell: req.body.percent_to_sell,
      pnl_to_stop: req.body.pnl_to_stop,
      max_pnl_start: req.body.max_pnl_start,
      max_pnl_threshold_to_quit: req.body.max_pnl_threshold_to_quit
    };

    // create new chain
    const newOrderChain = await marketOrderChainService.create({
      status: "open",
      price_start: "0.000", // can't defined
      total_balance_start: "0.000", // can't defined
      ...params,
    });
    // update global data
    global.openingChain = newOrderChain;

    await prepareDataBot();

    // call to service
    await botService.active();

    ServerResponse.response(res, newOrderChain);
  } catch (err) {
    console.log(err);
    ServerResponse.error(res, err.message);
  }
};

const quit: IController = async (req, res) => {
  try {
    // call service
    const ordersPlacedToClosePositions = await botService.quit();

    ServerResponse.response(res, ordersPlacedToClosePositions);
  } catch (err) {
    ServerResponse.error(res, err.message);
  }
};
export default { active, quit };
