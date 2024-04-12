import binanceController from "../controllers/binance.controller";
import express from "express";

const binanceRoute = express.Router();
binanceRoute.get('/ohlcv', binanceController.getOHLCV)
export default binanceRoute;
