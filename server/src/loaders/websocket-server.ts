import * as http from "http";
import { Server } from "socket.io";
import { TWsServer } from "../types/websocket/ws-server.type";

export const createWebSocketServerInstance = (httpServer: http.Server) => {
  const io: TWsServer = new Server(httpServer, {
    cors: { origin: "*", credentials: true },
  });

  io.on("connection", (socket) => {
    console.log("new client connect");

    socket.emit("noArg");
  });

  return io;
};
