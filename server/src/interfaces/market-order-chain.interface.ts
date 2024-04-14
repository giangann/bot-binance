import { IMarketOrderPieceRecord } from "market-order-piece.interface";

export type TOrderChainStatus = "open" | "closed";

export interface IMarketOrderChainRecord {
  id: number;
  status: TOrderChainStatus;
  total_balance_start: string;
  total_balance_end?: string;
  percent_change?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IMarketOrderChainEntity extends IMarketOrderChainRecord {
  order_pieces: IMarketOrderPieceRecord[];
}

export interface IMarketOrderChainCreate {
  status: TOrderChainStatus;
  total_balance_start: string;
}

export interface IMarketOrderChainUpdate {
  id: number;
  status: TOrderChainStatus;
  total_balance_end: string;
  percent_change: string;
  updatedAt: string;
}
