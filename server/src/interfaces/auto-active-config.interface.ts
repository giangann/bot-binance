import { TOrderChainPriceType } from "./market-order-chain.interface";

export type TAutoActiveStatus = "on" | "off";
export interface IAutoActiveConfigRecord {
  id: number;
  auto_active: TAutoActiveStatus;
  auto_active_decrease_price: string;
  max_pnl_start: string;
  max_pnl_threshold_to_quit: string;
  symbol_max_pnl_start: string;
  symbol_max_pnl_threshold: string;
  symbol_pnl_to_cutloss: string;
  percent_to_buy: string;
  percent_to_first_buy: string;
  percent_to_sell: string;
  pnl_to_stop: string;
  price_type: TOrderChainPriceType;
  transaction_size_start: number;

  createdAt: string;
  updatedAt: string;
}
export interface IAutoActiveConfigEntity extends IAutoActiveConfigRecord {}

// interface without id
export interface IAutoActiveConfigRecordWithoutId extends Omit<IAutoActiveConfigRecord, "id"> {}
export interface IAutoActiveConfigEntitywithoutId extends Omit<IAutoActiveConfigEntity, "id"> {}

export interface IAutoActiveConfigCreate {
  auto_active: TAutoActiveStatus;
  auto_active_decrease_price: string;
  max_pnl_start: string;
  max_pnl_threshold_to_quit: string;
  symbol_max_pnl_start: string;
  symbol_max_pnl_threshold: string;
  symbol_pnl_to_cutloss: string;
  percent_to_buy: string;
  percent_to_first_buy: string;
  percent_to_sell: string;
  pnl_to_stop: string;
  price_type: TOrderChainPriceType;
  transaction_size_start: number;

  createdAt?: string;
  updatedAt?: string;
}

export interface IAutoActiveConfigUpdate {
  id: number;
  auto_active?: TAutoActiveStatus;
  auto_active_decrease_price?: string;
  max_pnl_start?: string;
  max_pnl_threshold_to_quit?: string;
  symbol_max_pnl_start?: string;
  symbol_max_pnl_threshold?: string;
  symbol_pnl_to_cutloss?: string;
  percent_to_buy?: string;
  percent_to_first_buy?: string;
  percent_to_sell?: string;
  pnl_to_stop?: string;
  price_type?: TOrderChainPriceType;
  transaction_size_start?: number;

  updatedAt?: string;
}

export interface IAutoActiveConfigUpdateOne extends Omit<IAutoActiveConfigUpdate, "id"> {}
