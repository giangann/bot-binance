import { Router } from "express";
import marketOrderChainController from "../controllers/market-order-chain-controller";
const orderChainRoute = Router();

orderChainRoute.get("/", marketOrderChainController.list);
orderChainRoute.get("/pieces-by-id", marketOrderChainController.getPiecesById);
orderChainRoute.get("/log/:chainId", marketOrderChainController.getLogs);
orderChainRoute.get("/is-bot-active", marketOrderChainController.isBotActive);

export default orderChainRoute;
