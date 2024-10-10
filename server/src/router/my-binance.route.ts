import express from "express";
import myBinanceController from "../controllers/my-binance.controller";

const myBinanceRoute = express.Router();
myBinanceRoute.post("/create-market-order", myBinanceController.createMarketOrder);
myBinanceRoute.get("/position-info", myBinanceController.getPosition);
myBinanceRoute.get("/account-info", myBinanceController.getAccInfo);
myBinanceRoute.post("/close-all-long-positions", myBinanceController.closeAllLongPositions);

export default myBinanceRoute;
