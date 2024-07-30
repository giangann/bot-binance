import { TOrderChainPriceType } from "./market-order-chain.interface";

export interface IAutoActiveConfigRecord {
  id: number;
  auto_active_decrease_price: string;
  max_pnl_start: string;
  max_pnl_threshold_to_quit: string;
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

export interface IAutoActiveConfigCreate {
  auto_active_decrease_price: string;
  max_pnl_start: string;
  max_pnl_threshold_to_quit: string;
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
  auto_active_decrease_price?: string;
  max_pnl_start?: string;
  max_pnl_threshold_to_quit?: string;
  percent_to_buy?: string;
  percent_to_first_buy?: string;
  percent_to_sell?: string;
  pnl_to_stop?: string;
  price_type?: TOrderChainPriceType;
  transaction_size_start?: number;

  updatedAt?: string;
}
