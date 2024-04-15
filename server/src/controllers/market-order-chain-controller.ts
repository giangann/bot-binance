import IController from "IController";
import marketOrderChainService from "../services/market-order-chain.service";
import { ServerResponse } from "../ultils/server-response.ultil";

const list: IController = async (req, res) => {
  try {
    const listChain = await marketOrderChainService.list();
    ServerResponse.response(res, listChain);
  } catch (err) {
    ServerResponse.error(res, err.message);
  }
};


export default { list };
