"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.quitBot = exports.activeBot = void 0;
const market_order_chain_service_1 = __importDefault(require("../services/market-order-chain.service"));
const market_order_piece_service_1 = __importDefault(require("../services/market-order-piece.service"));
const gen_ws_message_to_client_1 = require("./gen-ws-message-to-client");
const activeBot = () => {
    const time = 4;
    global.botInterval = setInterval(tick, time * 1000);
};
exports.activeBot = activeBot;
const tick = () => {
    const newOrderPiece = (0, gen_ws_message_to_client_1.genWsMessageToClient)();
    const orderPiecesMap = global.orderPiecesMap;
    const { symbol } = newOrderPiece;
    // emit to client
    global.wsServerInstance.emit("new-order-placed", newOrderPiece);
    //   update memory
    if (symbol in orderPiecesMap) {
        global.orderPiecesMap[symbol].unshift(newOrderPiece);
    }
    else {
        global.orderPiecesMap[symbol] = [newOrderPiece];
    }
    // push newOrderPiece to array
    global.orderPieces.push(newOrderPiece);
    // save to db
    market_order_piece_service_1.default.create(newOrderPiece);
};
const quitBot = async () => {
    await market_order_chain_service_1.default.update({
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
exports.quitBot = quitBot;
