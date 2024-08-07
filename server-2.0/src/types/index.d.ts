import WebSocket from "ws";
import { IAutoActiveConfigEntitywithoutId } from "../interfaces/auto-active-config.interface";
import { ICoinPrice1AMMap } from "../interfaces/coin-price-1am.interface";
import { IMarketOrderChainEntity } from "../interfaces/market-order-chain.interface";
import {
  IMarketOrderPieceEntity,
  TOrderPiecesMap,
} from "../interfaces/market-order-piece.interface";
import {
  TSymbolMarketPrice,
  TSymbolMarketPricesMap,
  TSymbolTickerPrice,
  TSymbolTickerPricesMap,
} from "./rest-api";
import { TExchangeInfoSymbolsMap } from "./rest-api/exchange-info.type";
import { TPositionsMap } from "./rest-api/position.type";
import { TOrderInfosMap } from "./websocket/order-info.type";
import { TWsServer } from "./websocket/ws-server.type";

declare global {
  var wsServerInstance: TWsServer;
  var orderPlaceWsConnection: WebSocket;
  var updatePositionsWsConnection: WebSocket;
  var closePositionsWsConnection: WebSocket;

  var ableOrderSymbolsMap: Record<string, boolean>;
  var symbolPricesStartMap: ICoinPrice1AMMap | null;

  var symbolTickerPricesNow: TSymbolTickerPrice[]; // just use in test
  var symbolTickerPricesNowMap: TSymbolTickerPricesMap;
  var symbolMarketPricesNow: TSymbolMarketPrice[];
  var symbolMarketPricesNowMap: TSymbolMarketPricesMap;

  var exchangeInfoSymbolsMap: TExchangeInfoSymbolsMap;
  var positionsMap: TPositionsMap;
  var orderPiecesMap: TOrderPiecesMap | null;
  var orderInfosMap: TOrderInfosMap | null;

  var orderPieces: IMarketOrderPieceEntity[] | null;
  var openingChain: IMarketOrderChainEntity | null;
  var isBotActive: boolean;

  var botInterval: NodeJS.Timeout | null;
  var isRunTick: boolean;

  var autoActiveBotConfig: IAutoActiveConfigEntitywithoutId | null
  var autoActiveCheckInterval: NodeJS.Timeout | null
}
export { };

