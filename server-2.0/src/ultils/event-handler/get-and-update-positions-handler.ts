import loggerService from "../../services/logger.service";
import { TPositionWsResponse } from "../../types/websocket/position.type";
import { fakeDelay, positionsToMap } from "../helper";

export const getAndUpdatePositionsEventHandler = async (msg: any) => {
  try {
    // process stream data
    const msgString = msg.toString();
    const positionsResponse: TPositionWsResponse = JSON.parse(msgString);
    await fakeDelay(Math.random());
    // process response
    const resultKey = "result";
    const errorKey = "error";
    if (resultKey in positionsResponse) {
      // update memory
      const positions = positionsResponse["result"];
      const positionsMap = positionsToMap(positions);

      // update data memory
      global.positionsMap = positionsMap;
      // mark as able to run remain tick function
      global.isRunTick = true;
    }
    if (errorKey in positionsResponse) {
      // handle error
      console.log(positionsResponse[errorKey]);
      throw new Error("Error occur in response of account.position resquest");
    }
  } catch (err) {
    loggerService.saveError(err);
  }
};
