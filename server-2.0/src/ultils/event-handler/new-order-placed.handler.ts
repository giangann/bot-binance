import moment from "moment";
import { IMarketOrderPieceEntity } from "../../interfaces/market-order-piece.interface";
import { updatePositionsWebsocket } from "../../services/binance.service";
import {
  TNewOrderPlaceResponse,
  TNewOrderPlaceResult,
} from "../../types/websocket/order-place-response.type";
import { errorWsApiResponseToString, rateLimitsArrayToString } from "../helper";
import { TBinanceError } from "../../types/rest-api";
import loggerService from "../../services/logger.service";

////////////////////////////////////////////////////
// handle when new order placed
export const newOrderPlaceEvHandlerWs = (msg: any): void => {
  try{
    //-- Parse message
    const orderPlaceResponse: TNewOrderPlaceResponse = JSON.parse(msg.toString());
  
    //////////////////////////////////////////// --Log for debug //////////////////////////////////////////
    const { id, status, error, result, rateLimits } = orderPlaceResponse;
    let debugMsg = ''
    if (error){
      debugMsg = `ID: ${id}, STATUS: ${status}, ERROR: ${errorWsApiResponseToString(error)}, RATE_LIMITS: ${rateLimitsArrayToString(rateLimits)}`
    }
    if (result){
      const {symbol, origQty, side} = result
      debugMsg = `ID: ${id}, STATUS: ${status}, RESULT: ${side} ${origQty} ${symbol}, RATE_LIMITS: ${rateLimitsArrayToString(rateLimits)}`
    }
    console.log(debugMsg)
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  
    //-- Check parsedMsg is success or error
    const resultKey = "result";
    const errorKey = "error";
    if (resultKey in orderPlaceResponse) {
      const generatedID = orderPlaceResponse.id;
      const orderPlaceResult: TNewOrderPlaceResult =
        orderPlaceResponse[resultKey];
      // update order pieces store in memory
      updateOrderPieces(generatedID, orderPlaceResult);
      // update positions in memory
      updatePositionsWebsocket();
    }
    if (errorKey in orderPlaceResponse) {
      // updateErrorLog()
      const generatedID = orderPlaceResponse.id
      const orderError = orderPlaceResponse[errorKey]
      handleOrderError(generatedID,orderError)
    }
  }catch(err){
    loggerService.saveError(err)
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

  console.log("global.orderInfosMap length:", Object.keys(global.orderInfosMap).length);

  // process data from newOrder
  const newOrderPieces: IMarketOrderPieceEntity = {
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
    global.orderPiecesMap[symbol].unshift(newOrderPieces);
  } else {
    global.orderPiecesMap[symbol] = [newOrderPieces];
  }

  // push newOrderpieces to array
  global.orderPieces.push(newOrderPieces)

  // emit to client
  global.wsServerInstance.emit('new-order-placed',newOrderPieces)

  console.log('global.orderPiecesMap length: ',Object.keys(global.orderPiecesMap).length)
  console.log('global.orderPieces length: ',global.orderPieces.length)
};

/////////////////////////////////////////////////////////
// handle error order
export function handleOrderError(uuid: string, error: TBinanceError){
    // Find order information in memory:
    const orderInfo = global.orderInfosMap[uuid];
    const { symbol, quantity } = orderInfo
    const { code, msg } = error

    // Update able order symbol map
    if (isNeedRemove(code)){
      global.ableOrderSymbolsMap[symbol] = false
      console.log(`Error order symbol removed, ${symbol} with errorCode: ${error}`)
    } else {
      // other handler
      console.log(`Unknown error: ${symbol} ${quantity} ${code} - ${msg}`)
    }

    console.log(`Able symbols: ${Object.entries(global.ableOrderSymbolsMap).filter(([_symbol,able])=>able).length}`)
}

export function isNeedRemove (errorCode: number){
  const errorCodeNotAccept: number[] = [-4131,-2019,-2020]
  if (errorCodeNotAccept.includes(errorCode)) return true
  return false
}
