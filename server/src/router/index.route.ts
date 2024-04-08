import express from "express";
import binanceRoute from "./binance.route";

const indexRoute = express.Router();

indexRoute.use("/binance", binanceRoute);
export default indexRoute;
