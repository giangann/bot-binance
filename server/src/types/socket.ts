import { Server } from "socket.io";
import { TSymbolPrice } from "./symbol-price";

export interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
  "ws-balance": (
    total: number,
    total_usdt: number,
    coins: { coin: string; amount: number; price: number; total: number }[]
  ) => void;
  "bot-running": (msg: string) => void;
  "new-order": (
    direction: string,
    transaction_size: number,
    percent_change: string,
    price: string,
    symbol: string
  ) => void;
  "new-orders": (nums_of_order: number) => void;
  "err-orders": (nums_of_errs: number) => void;
  "bot-quit": (msg: string) => void;
  "bot-err": (errMsg: string) => void;
  "symbols-price": (symbolPrices: TSymbolPrice[]) => void;
}

export interface ClientToServerEvents {
  hello: () => void;
  // parseUser: (user: IUserRecord) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  name: string;
  age: number;
}

export type TWsServer = Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;
