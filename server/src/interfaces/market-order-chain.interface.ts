import { IMarketOrderPieceRecord } from "./market-order-piece.interface";

export type TOrderChainStatus = "open" | "closed";
export type TOrderChainPriceType = "market" | "ticker";
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
  pnl_to_stop: string;
  is_over_pnl_to_stop: boolean;
  stop_reason?: string;
  max_pnl_start: string;
  max_pnl_threshold_to_quit: string;
  symbol_max_pnl_start: string;
  symbol_max_pnl_threshold: string;
  symbol_pnl_to_cutloss: string;
  is_max_pnl_start_reached: boolean;
  price_type: TOrderChainPriceType;
  start_reason?: string;
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
  price_start?: string;
  pnl_to_stop: string;
  max_pnl_start: string;
  max_pnl_threshold_to_quit: string;
  symbol_max_pnl_start: string;
  symbol_max_pnl_threshold: string;
  symbol_pnl_to_cutloss: string;
  price_type: TOrderChainPriceType;
  start_reason?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IMarketOrderChainUpdate {
  id: number;
  status?: TOrderChainStatus;
  total_balance_end?: string;
  price_end?: string;
  percent_change?: string;
  pnl_to_stop?: string;
  is_over_pnl_to_stop?: boolean;
  stop_reason?: string;
  is_max_pnl_start_reached?: boolean;
  price_type?: TOrderChainPriceType;
  updatedAt?: string;
}
