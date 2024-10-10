import { IDatasetRecord } from "./dataset.interface";
import { IMarketOrderChainCreate, IMarketOrderChainRecord, IMarketOrderChainUpdate } from "./market-order-chain.interface";
import { IMarketOrderPieceTestRecord } from "./market-order-piece-test.interface";

export interface IMarketOrderChainTestRecord extends IMarketOrderChainRecord {
  datasets_id: number;
}

export interface IMarketOrderChainTestEntity extends IMarketOrderChainTestRecord {
  dataset: IDatasetRecord;
  order_pieces_test: IMarketOrderPieceTestRecord[];
}

export interface IMarketOrderChainTestCreate extends IMarketOrderChainCreate {
  datasets_id: number;
}

export interface IMarketOrderChainTestUpdate extends IMarketOrderChainUpdate {}
