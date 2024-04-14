import { IMarketOrderChainRecord } from "market-order-chain.interface";

export interface IMarketOrderPieceRecord {
  id: string;
  market_order_chains_id: number;
  total_balance: string;
  percent_change: string;
  timestamp: string;
  createdAt: string;
  updatedAt: string;
}

export interface IMarketOrderPieceEntity extends IMarketOrderPieceRecord {
  order_chain: IMarketOrderChainRecord;
}

export interface IMarketOrderPieceCreate {
  id: string;
  market_order_chains_id: number;
  total_balance: string;
  percent_change: string;
  timestamp?: string;
}
