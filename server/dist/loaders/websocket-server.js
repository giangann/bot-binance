"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWebSocketServerInstance = void 0;
const socket_io_1 = require("socket.io");
const createWebSocketServerInstance = (httpServer) => {
    const io = new socket_io_1.Server(httpServer, {
        cors: { origin: "*", credentials: true },
    });
    io.on("connection", (socket) => {
        console.log("new client connect");
        socket.emit("noArg");
    });
    return io;
};
exports.createWebSocketServerInstance = createWebSocketServerInstance;
