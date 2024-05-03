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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_connect_1 = require("../loaders/db-connect");
const coin_service_1 = __importDefault(require("./coin.service"));
const coinService = new coin_service_1.default(true);
const test = () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, db_connect_1.connectDatabase)();
    const data = yield coinService.list();
    console.log("data", data);
});
test();
const message = '{"message":"read ECONNRESET","name":"Error","stack":"Error: read ECONNRESET\\n    at Function.AxiosError.from (/home/ann/Documents/freelancer/bot-binance/server/node_modules/axios/lib/core/AxiosError.js:89:14)\\n    at RedirectableRequest.handleRequestError (/home/ann/Documents/freelancer/bot-binance/server/node_modules/axios/lib/adapters/http.js:610:25)\\n    at RedirectableRequest.emit (node:events:517:28)\\n    at RedirectableRequest.emit (node:domain:489:12)\\n    at ClientRequest.eventHandlers.<computed> (/home/ann/Documents/freelancer/bot-binance/server/node_modules/follow-redirects/index.js:38:24)\\n    at ClientRequest.emit (node:events:517:28)\\n    at ClientRequest.emit (node:domain:489:12)\\n    at TLSSocket.socketErrorListener (node:_http_client:501:9)\\n    at TLSSocket.emit (node:events:517:28)\\n    at TLSSocket.emit (node:domain:489:12)\\n    at Axios.request (/home/ann/Documents/freelancer/bot-binance/server/node_modules/axios/lib/core/Axios.js:45:41)\\n    at processTicksAndRejections (node:internal/process/task_queues:95:5)","config":{"transitional":{"silentJSONParsing":true,"forcedJSONParsing":true,"clarifyTimeoutError":false},"adapter":["xhr","http"],"transformRequest":[null],"transformResponse":[null],"timeout":0,"xsrfCookieName":"XSRF-TOKEN","xsrfHeaderName":"X-XSRF-TOKEN","maxContentLength":-1,"maxBodyLength":-1,"env":{},"headers":{"Accept":"application/json, text/plain, */*","User-Agent":"axios/1.6.8","Accept-Encoding":"gzip, compress, deflate, br"},"method":"get","url":"https://testnet.binancefuture.com/fapi/v2/ticker/price"},"code":"ECONNRESET","status":null}';
