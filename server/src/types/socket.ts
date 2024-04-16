import { Server } from "socket.io";

export interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
  "ws-balance": (total: number, btc: number, usdt: number) => void;
  "bot-running": (msg: string) => void;
  "new-order": (
    direction: string,
    transaction_size: number,
    percent_change: string,
    price: string,
    symbol: string
  ) => void;
  "bot-quit": (msg: string) => void;
  "bot-err": (errMsg: string) => void;
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
