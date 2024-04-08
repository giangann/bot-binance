"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadApp = void 0;
const cron_job_1 = require("./cron-job");
const db_connect_1 = require("./db-connect");
const http_server_1 = require("./http-server");
const ws_server_1 = require("./ws-server");
const loadApp = () => __awaiter(void 0, void 0, void 0, function* () {
    const httpServer = (0, http_server_1.createHttpServer)();
    const wsServer = (0, ws_server_1.createWebSocket)(httpServer);
    global.wsServerGlob = wsServer;
    (0, cron_job_1.cronJobSchedule)();
    yield (0, db_connect_1.connectDatabase)();
    return {
        httpServer,
        wsServer,
    };
});
exports.loadApp = loadApp;
