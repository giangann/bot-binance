import { IMarketOrderChainRecord } from "market-order-chain.interface";

export interface IMarketOrderPieceRecord {
  id: string;
  market_order_chains_id: number;
  symbol: string;
  direction: string;
  total_balance: string;
  price: string;
  percent_change: string;
  amount: string;
  transaction_size: string;
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
  symbol: string;
  direction: string;
  price: string;
  percent_change: string;
  amount: string;
  transaction_size: string;
  timestamp?: string;
}

export interface IMarketOrderPieceList
  extends Partial<IMarketOrderPieceRecord> {}
