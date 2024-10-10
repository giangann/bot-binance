import { IMarketOrderChainTestRecord } from "./market-order-chain-test.interface";
import { IMarketOrderPieceCreate, IMarketOrderPieceEntity, IMarketOrderPieceList, IMarketOrderPieceRecord } from "./market-order-piece.interface";

export interface IMarketOrderPieceTestRecord extends Omit<IMarketOrderPieceRecord, "market_order_chains_id"> {
  market_order_chains_test_id: number;
}

export interface IMarketOrderPieceTestEntity extends IMarketOrderPieceEntity {
  order_chain: IMarketOrderChainTestRecord;
}

export interface IMarketOrderPieceTestCreate extends Omit<IMarketOrderPieceCreate, "market_order_chains_id"> {
  market_order_chains_test_id: number;
}

export interface IMarketOrderPieceTestList extends IMarketOrderPieceList {}

export type TOrderPiecesTestMap = Record<string, IMarketOrderPieceTestEntity[]>;
