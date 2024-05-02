import { connectDatabase } from "../loaders/db-connect";
import CoinService from "./coin.service";
import logService from "./log.service";

const coinService = new CoinService(true);
const test = async () => {
  await connectDatabase();
  const data = await coinService.list();
  console.log("data", data);
};
test();

const message =
  '{"message":"read ECONNRESET","name":"Error","stack":"Error: read ECONNRESET\\n    at Function.AxiosError.from (/home/ann/Documents/freelancer/bot-binance/server/node_modules/axios/lib/core/AxiosError.js:89:14)\\n    at RedirectableRequest.handleRequestError (/home/ann/Documents/freelancer/bot-binance/server/node_modules/axios/lib/adapters/http.js:610:25)\\n    at RedirectableRequest.emit (node:events:517:28)\\n    at RedirectableRequest.emit (node:domain:489:12)\\n    at ClientRequest.eventHandlers.<computed> (/home/ann/Documents/freelancer/bot-binance/server/node_modules/follow-redirects/index.js:38:24)\\n    at ClientRequest.emit (node:events:517:28)\\n    at ClientRequest.emit (node:domain:489:12)\\n    at TLSSocket.socketErrorListener (node:_http_client:501:9)\\n    at TLSSocket.emit (node:events:517:28)\\n    at TLSSocket.emit (node:domain:489:12)\\n    at Axios.request (/home/ann/Documents/freelancer/bot-binance/server/node_modules/axios/lib/core/Axios.js:45:41)\\n    at processTicksAndRejections (node:internal/process/task_queues:95:5)","config":{"transitional":{"silentJSONParsing":true,"forcedJSONParsing":true,"clarifyTimeoutError":false},"adapter":["xhr","http"],"transformRequest":[null],"transformResponse":[null],"timeout":0,"xsrfCookieName":"XSRF-TOKEN","xsrfHeaderName":"X-XSRF-TOKEN","maxContentLength":-1,"maxBodyLength":-1,"env":{},"headers":{"Accept":"application/json, text/plain, */*","User-Agent":"axios/1.6.8","Accept-Encoding":"gzip, compress, deflate, br"},"method":"get","url":"https://testnet.binancefuture.com/fapi/v2/ticker/price"},"code":"ECONNRESET","status":null}';
