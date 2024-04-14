import { Router } from "express";
import marketOrderChainController from "../controllers/market-order-chain-controller";
const orderChainRoute = Router();

orderChainRoute.post("/", marketOrderChainController.create);
export default orderChainRoute;
