import moment from "moment";
import { IMarketOrderPieceEntity } from "../../interfaces/market-order-piece.interface";
import loggerService from "../../services/logger.service";
import { TBinanceError } from "../../types/rest-api";
import {
  TNewOrderPlaceResponse,
  TNewOrderPlaceResult,
} from "../../types/websocket/order-place-response.type";
import marketOrderPieceService from "../../services/market-order-piece.service";

////////////////////////////////////////////////////
// handle when new order placed
export const newOrderPlaceEvHandlerWs = (msg: any): void => {
  try {
    //-- Parse message
    const orderPlaceResponse: TNewOrderPlaceResponse = JSON.parse(msg.toString());

    //-- Check parsedMsg is success or error
    const resultKey = "result";
    const errorKey = "error";

    if (resultKey in orderPlaceResponse) {
      const generatedID = orderPlaceResponse.id;
      const orderPlaceResult: TNewOrderPlaceResult = orderPlaceResponse[resultKey];
      // update order pieces store in memory
      updateOrderPieces(generatedID, orderPlaceResult);
      // update positions in memory
      // updatePositionsWebsocket();
    }
    if (errorKey in orderPlaceResponse) {
      // updateErrorLog()
      const generatedID = orderPlaceResponse.id;
      const orderError = orderPlaceResponse[errorKey];
      handleOrderError(generatedID, orderError);
    }
  } catch (err) {
    loggerService.saveError(err);
    console.error("Error in newOrderPlaceEvHandlerWs:", err); // Debugging log
  }
};

/////////////////////////////////////////////////////////
// update memory data
export const updateOrderPieces = (
  uuid: string,
  newOrder: TNewOrderPlaceResult
) => {
  const symbol = newOrder.symbol;
  const orderPiecesMap = global.orderPiecesMap;
  const openingChain = global.openingChain;

  // Find order information in memory:
  const orderInfo = global.orderInfosMap[uuid];

  // log
  loggerService.saveDebugAndClg(`${newOrder.side} ${newOrder.origQty} ${symbol} with prevPrice: ${orderInfo.prevPrice}, currPrice: ${orderInfo.currPrice}, percentChange: ${orderInfo.percentChange}, positionAmt: ${orderInfo.positionAmt} `);

  // process data from newOrder
  const newOrderPiece: IMarketOrderPieceEntity = {
    id: newOrder.orderId.toString(),
    symbol: symbol,
    direction: newOrder.side,
    quantity: newOrder.origQty,
    transaction_size: orderInfo.amount.toString(),

    price: orderInfo.currPrice.toString(),
    percent_change: orderInfo.percentChange.toString(),

    market_order_chains_id: openingChain.id,
    order_chain: openingChain,

    createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
    updatedAt: moment().format("YYYY-MM-DD HH:mm:ss"),
    timestamp: newOrder.updateTime.toString(),
    total_balance: "0.00", // undefined
  };

  // update memory data: unshift newOrder to array (add to head)
  if (symbol in orderPiecesMap) {
    global.orderPiecesMap[symbol].unshift(newOrderPiece);
  } else {
    global.orderPiecesMap[symbol] = [newOrderPiece];
  }

  // push newOrderPiece to array
  global.orderPieces.push(newOrderPiece);

  // save to db
  marketOrderPieceService.create(newOrderPiece)

  // emit to client
  global.wsServerInstance.emit('new-order-placed', newOrderPiece);
};

/////////////////////////////////////////////////////////
// handle error order
export function handleOrderError(uuid: string, error: TBinanceError) {
  // Find order information in memory:
  const orderInfo = global.orderInfosMap[uuid];
  const { symbol, quantity, direction } = orderInfo;
  const { code, msg } = error;
  loggerService.saveDebugAndClg(`ERROR: ${direction} ${quantity} ${symbol} // ${code} ${msg}`)

  // Update able order symbol map
  if (isNeedRemove(code)) {
    global.ableOrderSymbolsMap[symbol] = false;
  } else {
    // other handler
  }
}

export function isNeedRemove(errorCode: number) {
  const errorCodeNotAccept: number[] = [-4131,-4003, -2019, -2020];
  if (errorCodeNotAccept.includes(errorCode)) return true;
  return false;
}
