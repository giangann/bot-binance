import express from "express";
import binanceRoute from "./binance.route";

const indexRoute = express.Router();

indexRoute.use("/binance", binanceRoute);

indexRoute.use("/", (req, res) => res.json("this is express app bot api"));
export default indexRoute;
