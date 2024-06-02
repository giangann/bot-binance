"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const market_order_chain_service_1 = __importDefault(require("../services/market-order-chain.service"));
const db_connect_1 = require("../loaders/db-connect");
// const testError = async () => {
//   try {
//     await connectDatabase();
//     const defaultParams: IMarketOrderChainCreate = {
//       status: "open",
//       total_balance_start: "",
//       transaction_size_start: 0,
//       percent_to_first_buy: "",
//       percent_to_buy: "",
//       percent_to_sell: "",
//       price_start: "",
//     };
//     const startTime = Date.now();
//     const promise1 = marketOrderChainService.create(defaultParams);
//     const promise2 = marketOrderChainService.create(defaultParams);
//     const promise5 = Promise.reject("Unexpected Error");
//     const promise3 = marketOrderChainService.create(defaultParams);
//     const promise4 = marketOrderChainService.create(defaultParams);
//     const promiseArr = [promise1, promise2, promise5, promise3, promise4];
//     const response = await Promise.allSettled(promiseArr);
//     console.log("promise all response:", response);
//     console.log("total time:", Date.now() - startTime);
//   } catch (err) {
//     loggerService.saveErrorLog(err);
//   }
// };
const testError = async () => {
    await (0, db_connect_1.connectDatabase)();
    const defaultParams = {
        status: "open",
        total_balance_start: "",
        transaction_size_start: 0,
        percent_to_first_buy: "",
        percent_to_buy: "",
        percent_to_sell: "",
        // price_start: "",
    };
    const startTime = Date.now();
    const promise1 = market_order_chain_service_1.default.create(defaultParams);
    const promise2 = market_order_chain_service_1.default.create(defaultParams);
    const promise5 = Promise.reject("Unexpected Error");
    const promise3 = market_order_chain_service_1.default.create(defaultParams);
    const promise4 = market_order_chain_service_1.default.create({
        ...defaultParams,
        price_start: "",
    });
    const promiseArr = [promise1, promise2, promise5, promise3, promise4];
    const response = await Promise.all(promiseArr)
        .then((value) => console.log(value))
        .catch((err) => console.log(err));
    console.log("promise all response:", response);
    console.log("total time:", Date.now() - startTime);
};
// testError();
