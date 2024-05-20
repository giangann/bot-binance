import IController from "IController";
import botService from "../services/bot.service";
import marketOrderChainService from "../services/market-order-chain.service";
import { ServerResponse } from "../ultils/server-response.ultil";
import binanceService from "../services/binance.service";
import { logger } from "../loaders/logger.config";

const active: IController = async (req, res) => {
  try {
    let params = {
      transaction_size_start: req.body.transaction_size,
      percent_to_first_buy: req.body.percent_to_first_buy,
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

const quit: IController = async (req, res) => {
  try {
    const positions = await binanceService.getPositions();

    // make promises and fullfilled
    const orderPromises = positions.map((position) => {
      let symbol = position.symbol;
      let quantity = parseInt(position.positionAmt);
      let side: "SELL" | "BUY" = "SELL";
      return binanceService.createMarketOrder(symbol, side, quantity);
    });
    const orderResult = await Promise.all(orderPromises);

    // log and error
    let numOfSuccess = 0;
    let numOfFailure = 0;
    for (let res of orderResult) {
      if (res.success === true) {
        const { orderId, side, origQty, symbol } = res.data;
        numOfSuccess += 1;

        // log order info
        const msg = `orderId: ${orderId}, symbol: ${symbol}, quantity: ${origQty}, side: ${side}`;
        logger.info(msg);
      } else {
        numOfFailure += 1;
        // log error message
        const {
          error: { code, msg },
          payload,
        } = res;
        const { symbol, quantity, side } = payload;
        const logMsg = `${code} - ${msg}, symbol: ${symbol}, quantity: ${quantity}, side: ${side}`;
        logger.info(logMsg);
      }
    }

    const data = { numOfSuccess, numOfFailure };

    await botService.quit();

    ServerResponse.response(res, data);
  } catch (err) {
    ServerResponse.error(res, err.message);
  }
};
export default { active, quit };
