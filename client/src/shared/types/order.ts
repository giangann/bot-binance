export type TOrderChainStatus = "open" | "closed";

export interface IMarketOrderChainRecord {
  id: number;
  status: TOrderChainStatus;
  order_pieces: IMarketOrderPieceRecord[];
  createdAt: string;
  updatedAt: string;
}

export interface IMarketOrderPieceRecord {
  id: string;
  market_order_chains_id: number;
  total_balance: string;
  order_chain: IMarketOrderChainRecord;
  timestamp: string;
  createdAt: string;
  updatedAt: string;
}
