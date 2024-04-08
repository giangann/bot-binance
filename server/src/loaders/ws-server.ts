import * as http from "http";
import { Server } from "socket.io";
import { TWsServer } from "../types/socket";
export const createWebSocket = (httpServer: http.Server) => {
  const io: TWsServer = new Server(httpServer, {
    cors: { origin: "*", credentials: true },
  });

  io.on("connection", (socket) => {
    console.log("new client connect");

    // socket.on("parseUser", (user) => {
    //   socket.data.user = user;
    // });
  });

  return io;
};
