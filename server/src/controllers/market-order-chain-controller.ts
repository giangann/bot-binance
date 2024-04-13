import IController from "IController";
import { IMarketOrderChainCreate } from "market-order-chain.interface";
import marketOrderChainService from "../services/market-order-chain.service";
import marketOrderPieceService from "../services/market-order-piece.service";
import { IMarketOrderPieceCreate } from "market-order-piece.interface";
import binanceService from "../services/binance.service";
import { connectDatabase } from "../loaders/db-connect";

const create: IController = async (req, res) => {
  let params: IMarketOrderChainCreate = {
    status: "open",
  };
  const newChain = await marketOrderChainService.create(params);

  let i = 0;
  const interval = setInterval(async () => {
    let newBinanceOrder = await binanceService.createMarketOrder(
      "BTC/USDT",
      "buy",
      0.01
    );
    let pieceParams: IMarketOrderPieceCreate = {
      id: newBinanceOrder.id.toString(),
      market_order_chains_id: newChain.id,
      total_balance: "10999",
    };
    marketOrderPieceService.create(pieceParams);

    let check = i === 4;
    if (check) clearInterval(interval);

    i = i + 1;
  }, 1000);

  // create new Interval
  // call function that take interval and stop when something happen?
};

const create2 = async () => {
  await connectDatabase();
  let params: IMarketOrderChainCreate = {
    status: "open",
  };
  const newChain = await marketOrderChainService.create(params);

  let i = 0;
  const interval = setInterval(async () => {
    let newBinanceOrder = await binanceService.createMarketOrder(
      "BTC/USDT",
      "buy",
      0.01
    );
    let pieceParams: IMarketOrderPieceCreate = {
      id: newBinanceOrder.id.toString(),
      market_order_chains_id: newChain.id,
      total_balance: "10999",
    };
    marketOrderPieceService.create(pieceParams);

    let check = i === 4;
    if (check) clearInterval(interval);

    i = i + 1;
  }, 1000);

  // create new Interval
  // call function that take interval and stop when something happen?
};
export default { create };
