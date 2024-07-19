import { getPositions, getAccountInfo } from "../services/binance.service";
import IController from "../interfaces/IController";
import { ServerResponse } from "../ultils/server-response.ultil";
import { filterPositionsNotZero } from "../ultils/helper";
import loggerService from "../services/logger.service";

const getAccInfo: IController = async (req, res) => {
  try {
    const accInfo = await getAccountInfo();
    ServerResponse.response(res, accInfo);
  } catch (err) {
    loggerService.saveError(err);
    ServerResponse.error(res, err.message);
  }
};

const getPosition: IController = async (req, res) => {
  try {
  // get position from binance service
  const allPositions = await getPositions();
  const positionsNotZero = filterPositionsNotZero(allPositions);
  ServerResponse.response(res, positionsNotZero);
  } catch (err) {
    loggerService.saveError(err);
    ServerResponse.error(res, err.message);
  }
};

export default {
  getAccInfo,
  getPosition,
};
