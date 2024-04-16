import IController from "IController";
import binanceService from "../services/binance.service";
import botService from "../services/bot.service";
import marketOrderChainService from "../services/market-order-chain.service";
import { ServerResponse } from "../ultils/server-response.ultil";

const active: IController = async (req, res) => {
  try {
    let params = {
      symbol: req.body.symbol,
      transaction_size: parseFloat(req.body.transaction_size),
      transaction_increase: parseFloat(req.body.transaction_increase),
      percent_to_buy: parseFloat(req.body.percent_to_buy),
      percent_to_sell: parseFloat(req.body.percent_to_sell),
    };

    // create new chain
    const currPrice = await binanceService.getSymbolPriceNow(params.symbol);
    const currBalance = (await binanceService.getMyBalance()).total;
    const newOrderChain = await marketOrderChainService.create({
      price_start: currPrice.toString(),
      status: "open",
      total_balance_start: currBalance.toString(),
    });

    const isActived = await botService.active(params, newOrderChain.id);
    if (!isActived) {
      ServerResponse.error(res, "Cannot active bot, let check");
    }

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
