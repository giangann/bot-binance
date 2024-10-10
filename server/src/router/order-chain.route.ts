import { Router } from "express";
import marketOrderChainController from "../controllers/market-order-chain-controller";
const orderChainRoute = Router();

orderChainRoute.get("/", marketOrderChainController.list);
orderChainRoute.get("/pieces-by-id", marketOrderChainController.getPiecesById);
orderChainRoute.put("/:id", marketOrderChainController.update);
orderChainRoute.delete("/:id", marketOrderChainController.remove);
orderChainRoute.post("/mark-all-open-chain-as-closed", marketOrderChainController.markAllOpenChainsAsClosed);

export default orderChainRoute;
