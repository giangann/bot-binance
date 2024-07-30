import express from "express";
import botRoute from "./bot.route";
import coinPrice1amRoute from "./coin-price-1am-route";
import coinRoute from "./coin.route";
import orderChainRoute from "./order-chain.route";
import userRoute from "./user.route";
import autoActiveConfigRoute from "./auto-active-config.route";

const indexRoute = express.Router();

indexRoute.use("/coin-price-1am", coinPrice1amRoute);
indexRoute.use("/user", userRoute);
indexRoute.use("/order-chain", orderChainRoute);
indexRoute.use("/bot", botRoute);
indexRoute.use("/coin", coinRoute);
indexRoute.use("/config", autoActiveConfigRoute);

// default route
indexRoute.use("/", (req, res) =>
  res.json("This is default route: Hello to BOT BINANCE 2.0")
);

export default indexRoute;
