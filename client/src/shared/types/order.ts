export type TOrderChainStatus = "open" | "closed";

export interface IMarketOrderChainRecord {
  id: number;
  status: TOrderChainStatus;
  total_balance_start: string;
  total_balance_end?: string;
  percent_change?: string;

  order_pieces: IMarketOrderPieceRecord[];
  createdAt: string;
  updatedAt: string;
}

export interface IMarketOrderPieceRecord {
  id: string;
  symbol: string;
  direction: string;
  market_order_chains_id: number;
  total_balance: string;
  price: string;
  percent_change: string;
  order_chain: IMarketOrderChainRecord;
  timestamp: string;
  createdAt: string;
  updatedAt: string;
}
