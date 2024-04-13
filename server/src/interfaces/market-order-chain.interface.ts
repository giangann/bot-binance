import { IMarketOrderPieceRecord } from "market-order-piece.interface";

export type TOrderChainStatus = "open" | "closed";

export interface IMarketOrderChainRecord {
  id: number;
  status: TOrderChainStatus;
  createdAt: string;
  updatedAt: string;
}

export interface IMarketOrderChainEntity extends IMarketOrderChainRecord {
  order_pieces: IMarketOrderPieceRecord[];
}

export interface IMarketOrderChainCreate {
  status: TOrderChainStatus;
}

export interface IMarketOrderChainUpdate {
  id: number;
  status: TOrderChainStatus;
  updatedAt: string;
}
