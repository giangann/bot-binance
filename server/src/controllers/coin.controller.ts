import IController from "IController";
import { ServerResponse } from "../ultils/server-response.ultil";

const getNowClosePrices: IController = (req, res) => {
  try {
    const prices = global.symbolsPrice;
    ServerResponse.response(res, prices);
  } catch (err) {
    console.log("err", err);
    ServerResponse.error(res, err.message);
  }
};

export default { getNowClosePrices };
