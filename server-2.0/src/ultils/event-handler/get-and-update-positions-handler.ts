import loggerService from "../../services/logger.service";
import {
  TPositionWsResponse
} from "../../types/websocket/position.type";
import { positionsToMap } from "../helper";

export const getAndUpdatePositionsEventHandler = (msg: any) => {
  try {
    // process stream data
    const msgString = msg.toString();
    const positionsResponse: TPositionWsResponse = JSON.parse(msgString);

    // process response
    const resultKey = "result";
    const errorKey = "error";
    if (resultKey in positionsResponse) {
      loggerService.saveDebugAndClg('position response successed!')
      const positions = positionsResponse["result"];
      const positionsMap = positionsToMap(positions);
      // update data memory
      global.positionsMap = positionsMap;
    }
    if (errorKey in positionsResponse) {
      // handle error
      console.log(positionsResponse[errorKey]);
      throw new Error("Error occur in response of account.position resquest");
    }
  } catch (err) {
    loggerService.saveError(err)
  }
};
