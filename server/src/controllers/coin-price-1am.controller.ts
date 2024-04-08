import IController from "IController";
import { ServerResponse } from "../ultils/server-response.ultil";
import coinService from "../services/coin.service";

const list: IController = async (req, res) => {
  try {
    const listCoinPrices = await coinService.list();
    return ServerResponse.response(res, listCoinPrices);
  } catch (err) {
    console.log(err)
    return ServerResponse.error(res, err.name || "Server err");
  }
};

export default { list };
