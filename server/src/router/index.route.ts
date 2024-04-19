import express from "express";
import binanceRoute from "./binance.route";
import coinPrice1amRoute from "./coin-price-1am-route";
import userRoute from "./user.route";
import orderChainRoute from "./order-chain.route";
import botRoute from "./bot.route";
import coinRoute from "./coin.route";

const indexRoute = express.Router();

indexRoute.use("/binance", binanceRoute);
indexRoute.use("/coin-price-1am", coinPrice1amRoute);
indexRoute.use("/coin", coinRoute);
indexRoute.use("/user", userRoute);
indexRoute.use("/order-chain", orderChainRoute);
indexRoute.use("/bot", botRoute);

// default route
indexRoute.use("/", (req, res) =>
  res.json("this is express app bot api test cpanel git repo deploy")
);

export default indexRoute;
