import { Modify, TResponseWithPagiSimple } from "./base";
import { IDatasetRecord } from "./dataset";

export type TOrderChainStatus = "open" | "closed";
export type TOrderChainPriceType = "market" | "ticker";

export interface IMarketOrderChainTestRecord {
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
  symbol_max_pnl_start: string;
  symbol_max_pnl_threshold: string;
  symbol_pnl_to_cutloss: string;
  price_type: TOrderChainPriceType;
  start_reason?: string;
  order_pieces: IMarketOrderPieceTestRecord[];
  dataset: IDatasetRecord;
  datasets_id: number;

  createdAt: string;
  updatedAt: string;
}

export interface IMarketOrderPieceTestRecord {
  id: string;
  market_order_chains_test_id: number;
  symbol: string;
  direction: string;
  total_balance: string;
  price: string;
  percent_change: string;
  quantity: string;
  transaction_size: string;
  reason: string | null;
  order_chain_test: IMarketOrderChainTestRecord;

  timestamp: string;
  createdAt: string;
  updatedAt: string;
}

export type TMarketOrderPiecesTestWithPagi = TResponseWithPagiSimple<IMarketOrderPieceTestRecord[]>;

export type TMarketOrderChainTestWithPiecesPagi = Modify<
  IMarketOrderChainTestRecord,
  {
    order_pieces_test: TMarketOrderPiecesTestWithPagi;
  }
>;
