import coinController from "../controllers/coin.controller";
import express from "express";

const coinRoute = express.Router();
coinRoute.get("/curr-price", coinController.getNowClosePrices);

export default coinRoute;
