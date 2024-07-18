import { getPositions, getAccountInfo } from "../services/binance.service";
import IController from "../interfaces/IController";
import { ServerResponse } from "../ultils/server-response.ultil";
import { filterPositionsNotZero } from "../ultils/helper";

const getAccInfo: IController = async (req, res) => {
  try {
    const accInfo = await getAccountInfo();
    ServerResponse.response(res, accInfo);
  } catch (err) {
    ServerResponse.error(res, err.message);
  }
};

const getPosition: IController = async (req, res) => {
  // get position from binance service
  const allPositions = await getPositions();
  const positionsNotZero = filterPositionsNotZero(allPositions);
  ServerResponse.response(res, positionsNotZero);
  try {
  } catch (err) {
    ServerResponse.error(res, err.message);
  }
};

export default {
  getAccInfo,
  getPosition,
};
