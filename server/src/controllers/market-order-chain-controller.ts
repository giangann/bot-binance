import IController from "IController";
import marketOrderChainService from "../services/market-order-chain.service";
import { ServerResponse } from "../ultils/server-response.ultil";
import logService from "../services/log.service";
import { IMarketOrderPieceCreate } from "market-order-piece.interface";
import marketOrderPieceService from "../services/market-order-piece.service";
import { logger } from "../loaders/logger.config";

const list: IController = async (req, res) => {
  try {
    const listChain = await marketOrderChainService.list();
    ServerResponse.response(res, listChain);
  } catch (err) {
    console.log("err", err);
    ServerResponse.error(res, err.message);
  }
};

const isBotActive: IController = async (req, res) => {
  try {
    const openChain = await marketOrderChainService.list({ status: "open" });

    ServerResponse.response(res, openChain.length);
  } catch (err) {
    console.log("err", err);
    ServerResponse.error(res, err.message);
  }
};

const getLogs: IController = async (req, res) => {
  try {
    const chainId = parseInt(req.params?.chainId);
    const logs = await logService.list({ market_order_chains_id: chainId });
    ServerResponse.response(res, logs);
  } catch (err) {
    console.log("err", err);
    ServerResponse.error(res, err.message);
  }
};

const testLogs: IController = async (req, res) => {
  try {
    const listChain = await marketOrderChainService.list();
    const idOfChainToSave = listChain[listChain.length - 1].id;

    const testPiece: IMarketOrderPieceCreate = {
      market_order_chains_id: idOfChainToSave,
      amount: "0",
      direction: "SELL",
      id: "0",
      percent_change: "0",
      price: "0",
      symbol: "0",
      total_balance: "0",
      transaction_size: "0",
    };
    const createdPiece = await marketOrderPieceService.create(testPiece);
    logger.debug("new test order created");

    ServerResponse.response(res, createdPiece);
  } catch (err) {
    ServerResponse.error(res, err.message);
  }
};

export default { list, getLogs, isBotActive, testLogs };
