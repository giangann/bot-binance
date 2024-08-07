import { ServerResponse } from "../ultils/server-response.ultil";
import IController from "../interfaces/IController";
import CoinService from "../services/coin-price-1am.service";

const list: IController = async (req, res) => {
  const testnet = req.query?.testnet;
  let isTestnet: boolean;
  if (testnet === "false") isTestnet = false;
  else isTestnet = true;

  const coinService = new CoinService(isTestnet);

  try {
    const listCoinPrices = await coinService.list();
    return ServerResponse.response(res, listCoinPrices);
  } catch (err) {
    console.log(err);
    return ServerResponse.error(res, err.name || "Server err");
  }
};

export default { list };
