import { Server } from "socket.io";
import { TSymbolPrice } from "./symbol-price";
import { TBinanceMarkPriceStreamToWs } from "./binance-stream";
import { TPosition } from "./position";
import { TAccount } from "./account";

export interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
  "ws-account-info": (accInfo: TAccount) => void;
  "ws-position": (positions: TPosition[]) => void;
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
  "order-err": (msg: string) => void;
  "app-err": (msg: string) => void;
  "bot-quit": (msg: string) => void;
  "bot-err": (errMsg: string) => void;
  "bot-tick": (
    num_of_order: number,
    num_of_success_order: number,
    num_of_error_order: number
  ) => void;
  "symbols-price": (symbolPrices: TSymbolPrice[]) => void;
  "testnet-binance-stream-forward": (msg: TBinanceMarkPriceStreamToWs) => void;
  "future-binance-stream-forward": (msg: TBinanceMarkPriceStreamToWs) => void;
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
