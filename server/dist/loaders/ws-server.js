"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWebSocket = void 0;
const socket_io_1 = require("socket.io");
const createWebSocket = (httpServer) => {
    const io = new socket_io_1.Server(httpServer, {
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
exports.createWebSocket = createWebSocket;
