import express from "express";
import autoActiveConfigRoute from "./auto-active-config.route";
import botRoute from "./bot.route";
import coinPrice1amRoute from "./coin-price-1am-route";
import coinRoute from "./coin.route";
import datasetItemRoute from "./dataset-item.route";
import datasetRoute from "./dataset.route";
import myBinanceRoute from "./my-binance.route";
import orderChainTestRoute from "./order-chain-test.route";
import orderChainRoute from "./order-chain.route";

const indexRoute = express.Router();

indexRoute.use("/coin-price-1am", coinPrice1amRoute);
indexRoute.use("/order-chain", orderChainRoute);
indexRoute.use("/order-chain-test", orderChainTestRoute);
indexRoute.use("/bot", botRoute);
indexRoute.use("/coin", coinRoute);
indexRoute.use("/config", autoActiveConfigRoute);
indexRoute.use("/dataset", datasetRoute);
indexRoute.use("/dataset-item", datasetItemRoute);
indexRoute.use("/my-binance", myBinanceRoute);
// default route
indexRoute.use("/", (req, res) => res.json("This is default route: Hello to BOT BINANCE 2.0"));

export default indexRoute;
