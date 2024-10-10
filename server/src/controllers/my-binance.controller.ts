import IController from "../interfaces/IController";
import { MyBinanceService } from "../services/my-binance.service";
import { filterPositionsNotZero } from "../ultils/helper";
import { ServerResponse } from "../ultils/server-response.ultil";

// Initialize myBinanceService with your base URL
const myBinanceService = new MyBinanceService();

// Controller for creating a market order
const createMarketOrder: IController = async (req, res) => {
  try {
    const { symbol, side, quantity, arbitraryId } = req.body;

    // Call myBinanceService to create a market order
    const result = await myBinanceService.createMarketOrder(symbol, side, quantity, arbitraryId);

    // Respond with the result
    ServerResponse.response(res, result);
  } catch (error) {
    // Handle and log errors
    ServerResponse.error(res, error.message);
  }
};

const getAccInfo: IController = async (req, res) => {
  try {
    const accInfo = await myBinanceService.getAccountInfo();
    ServerResponse.response(res, accInfo);
  } catch (err) {
    ServerResponse.error(res, err.message);
  }
};

const getPosition: IController = async (req, res) => {
  try {
    // get position from binance service
    const allPositions = await myBinanceService.getPositions();
    const positionsNotZero = filterPositionsNotZero(allPositions);
    ServerResponse.response(res, positionsNotZero);
  } catch (err) {
    ServerResponse.error(res, err.message);
  }
};

const closeAllLongPositions: IController = async (req, res) => {
  try {
    const { success, failure } = await myBinanceService.closeAllPositions();

    ServerResponse.response(res, { success, failure });
  } catch (err) {
    ServerResponse.error(res, err.message);
  }
};

export default { createMarketOrder, getAccInfo, getPosition, closeAllLongPositions };
