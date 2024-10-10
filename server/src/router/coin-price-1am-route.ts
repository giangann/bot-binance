import coinPrice1amController from "../controllers/coin-price-1am.controller";
import express from "express";

const coinPrice1amRoute = express.Router();
coinPrice1amRoute.get("/", coinPrice1amController.list);

export default coinPrice1amRoute;
