import { Router } from "express";
import marketOrderChainController from "../controllers/market-order-chain-controller";
const orderChainRoute = Router();

orderChainRoute.get("/", marketOrderChainController.list);
orderChainRoute.get("/log/:chainId", marketOrderChainController.getLogs);
orderChainRoute.get("/is-bot-active", marketOrderChainController.isBotActive);
orderChainRoute.get("/test-log", marketOrderChainController.testLogs);

export default orderChainRoute;
