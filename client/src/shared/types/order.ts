import { Modify, TResponseWithPagiSimple } from "./base";

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
  percent_change?: string;
  pnl_to_stop: string;
  stop_reason?: string;
  max_pnl_start: string;
  max_pnl_threshold_to_quit: string;
  price_type: TOrderChainPriceType;
  order_pieces: IMarketOrderPieceRecord[];
  createdAt: string;
  updatedAt: string;
}

export interface IMarketOrderPieceRecord {
  id: string;
  market_order_chains_id: number;
  symbol: string;
  direction: string;
  total_balance: string;
  price: string;
  percent_change: string;
  quantity: string;
  transaction_size: string;
  order_chain: IMarketOrderChainRecord;
  timestamp: string;
  createdAt: string;
  updatedAt: string;
}

export type TMarketOrderPiecesWithPagi = TResponseWithPagiSimple<
  IMarketOrderPieceRecord[]
>;

export type TMarketOrderChainWithPiecesPagi = Modify<
  IMarketOrderChainRecord,
  {
    order_pieces: TMarketOrderPiecesWithPagi;
  }
>;
