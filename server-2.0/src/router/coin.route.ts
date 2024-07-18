import express from "express";
import coinController from "../controllers/coin.controller";

const coinRoute = express.Router();
coinRoute.get("/update-price", coinController.updatePrice);

export default coinRoute;
