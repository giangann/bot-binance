import express from "express";
import binanceRoute from "./binance.route";
import coinPrice1amRoute from "./coin.route";

const indexRoute = express.Router();

indexRoute.use("/binance", binanceRoute);
indexRoute.use("/coin-price-1am", coinPrice1amRoute);

// default route
indexRoute.use("/", (req, res) => res.json("this is express app bot api"));

export default indexRoute;
