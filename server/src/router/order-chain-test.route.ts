import { Router } from "express";
import marketOrderChainTestController from "../controllers/market-order-chain-test-controller";
const orderChainTestRoute = Router();

orderChainTestRoute.get("/", marketOrderChainTestController.list);
orderChainTestRoute.get("/pieces-by-id", marketOrderChainTestController.getPiecesById);
orderChainTestRoute.delete("/:id", marketOrderChainTestController.remove);
orderChainTestRoute.post("/mark-all-open-chain-as-closed", marketOrderChainTestController.markAllOpenChainsAsClosed);

export default orderChainTestRoute;
