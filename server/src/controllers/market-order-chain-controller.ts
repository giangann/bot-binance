import IController from "IController";
import marketOrderChainService from "../services/market-order-chain.service";
import { ServerResponse } from "../ultils/server-response.ultil";
import logService from "../services/log.service";

const list: IController = async (req, res) => {
  try {
    const listChain = await marketOrderChainService.list();
    ServerResponse.response(res, listChain);
  } catch (err) {
    console.log("err", err);
    ServerResponse.error(res, err.message);
  }
};

const getLogs: IController = async (req, res) => {
  try {
    const chainId = parseInt(req.params?.chainId);
    const logs = await logService.list({ market_order_chains_id: chainId });
    ServerResponse.response(res, logs);
  } catch (err) {
    console.log("err", err);
    ServerResponse.error(res, err.message);
  }
};

export default { list, getLogs };
