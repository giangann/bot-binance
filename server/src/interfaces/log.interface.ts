import {
  IMarketOrderChainEntity,
  IMarketOrderChainRecord,
} from "market-order-chain.interface";

export interface ILogRecord {
  id: string;
  message: string;
  type: string;
  market_order_chains_id: number;
  createdAt: string;
  updatedAt: string;
}

export interface ILogEntity extends ILogRecord {
  order_chain: IMarketOrderChainRecord;
}

export interface ILogCreate {
  message: string;
  type: string;
  market_order_chains_id: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ILogList {
  market_order_chains_id: number;
}
