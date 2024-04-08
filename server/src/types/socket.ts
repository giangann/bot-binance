import { INotiRealtime } from "noti.interface";
import { Server } from "socket.io";
import { IUserRecord } from "user.interface";

export interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
  newNoti: (noti: INotiRealtime) => void;
}

export interface ClientToServerEvents {
  hello: () => void;
  parseUser: (user: IUserRecord) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  name: string;
  age: number;
  user: IUserRecord;
}

export type TWsServer = Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;
