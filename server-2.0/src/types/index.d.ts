import WebSocket from "ws";
import {
  ICoinPrice1AM,
  ICoinPrice1AMMap,
} from "../interfaces/coin-price-1am.interface";
import { IMarketOrderChainEntity } from "../interfaces/market-order-chain.interface";
import { TSymbolMarketPrice, TSymbolTickerPrice } from "./rest-api";
import { TExchangeInfoSymbolsMap } from "./rest-api/exchange-info.type";
import { TPositionsMap } from "./rest-api/position.type";
import { TOrderInfosMap } from "./websocket/order-info.type";
import { TWsServer } from "./websocket/ws-server.type";
import { IMarketOrderPieceEntity, TOrderPiecesMap } from "../interfaces/market-order-piece.interface";

declare global {
  var wsServerInstance: TWsServer;
  var orderPlaceWsConnection: WebSocket;
  var updatePositionsWsConnection: WebSocket;
  var closePositionsWsConnection: WebSocket;

  var ableOrderSymbolsMap: Record<string, boolean>;

  var symbolPricesStart: ICoinPrice1AM[] | null;
  var symbolPricesStartMap: ICoinPrice1AMMap | null;

  var symbolMarketPricesNow: TSymbolMarketPrice[];
  var symbolTickerPricesNow: TSymbolTickerPrice[];

  var exchangeInfoSymbolsMap: TExchangeInfoSymbolsMap;
  var positionsMap: TPositionsMap;
  var orderPiecesMap: TOrderPiecesMap | null;
  var orderInfosMap: TOrderInfosMap | null;

  var orderPieces: IMarketOrderPieceEntity[] | null;
  var openingChain: IMarketOrderChainEntity | null;
  var isBotActive: boolean;

  var tickCount: number
}
export {};
