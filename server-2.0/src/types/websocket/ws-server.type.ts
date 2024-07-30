import { Server } from "socket.io";
import { TBinanceMarkPriceStreamToWs } from "./binance-stream.type";
import { IMarketOrderPieceEntity } from "../../interfaces/market-order-piece.interface";

export interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
  "testnet-binance-stream-forward": (msg: TBinanceMarkPriceStreamToWs) => void;
  "future-binance-stream-forward": (msg: TBinanceMarkPriceStreamToWs) => void;
  "new-order-placed": (msg: IMarketOrderPieceEntity) => void;
  "bot-quit": (msg: string) => void;
  "bot-active": (activeReason: string) => void;
  "auto-active-check": (msg: {
    maxPrice: number;
    currPrice: number;
  }) => void;
}

export interface ClientToServerEvents {
  hello: () => void;
  // parseUser: (user: IUserRecord) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {}

export type TWsServer = Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;
