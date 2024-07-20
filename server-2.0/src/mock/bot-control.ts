import marketOrderChainService from "../services/market-order-chain.service";
import marketOrderPieceService from "../services/market-order-piece.service";
import { genWsMessageToClient } from "./gen-ws-message-to-client";

export const activeBot = () => {
  const time = 4;
  global.botInterval = setInterval(tick, time * 1000);
};

const tick = () => {
  const newOrderPiece = genWsMessageToClient();
  const orderPiecesMap = global.orderPiecesMap;

  const { symbol } = newOrderPiece;

  // emit to client
  global.wsServerInstance.emit("new-order-placed", newOrderPiece);

  //   update memory
  if (symbol in orderPiecesMap) {
    global.orderPiecesMap[symbol].unshift(newOrderPiece);
  } else {
    global.orderPiecesMap[symbol] = [newOrderPiece];
  }

  // push newOrderPiece to array
  global.orderPieces.push(newOrderPiece);

  // save to db
  marketOrderPieceService.create(newOrderPiece);
};

export const quitBot = async () => {
  await marketOrderChainService.update({
    id: global.openingChain.id,
    status: "closed",
  });

  global.orderPieces = [];
  global.orderPiecesMap = {};
  global.orderInfosMap = {};
  global.ableOrderSymbolsMap = {};

  global.openingChain = null;
  global.symbolPricesStartMap = null;
  global.exchangeInfoSymbolsMap = null;
  global.positionsMap = null;

  clearInterval(global.botInterval);

  return true;
};
