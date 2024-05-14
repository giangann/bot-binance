import { IMarketOrderPieceRecord } from "market-order-piece.interface";

export type TOrderChainStatus = "open" | "closed";

export interface IMarketOrderChainRecord {
  id: number;
  status: TOrderChainStatus;
  total_balance_start: string;
  transaction_size_start: number;
  percent_to_first_buy: string;
  percent_to_buy: string;
  percent_to_sell: string;
  total_balance_end?: string;
  price_start: string;
  price_end?: string;
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
  transaction_size_start: number;
  percent_to_first_buy: string;
  percent_to_buy: string;
  percent_to_sell: string;
  price_start: string;

  createdAt?: string;
  updatedAt?: string;
}

export interface IMarketOrderChainUpdate {
  id: number;
  status: TOrderChainStatus;
  total_balance_end: string;
  price_end: string;
  percent_change: string;
  updatedAt: string;
}
