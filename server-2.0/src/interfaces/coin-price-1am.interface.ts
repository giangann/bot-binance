import { TUpdateRecord } from "./generic.type";

export interface ICoinPrice1AM {
  id: number;
  symbol: string;
  price?: string;
  mark_price?: string;
  createdAt: string;
  updatedAt: string;
}
export interface ICoinPrice1AMCreate {
  symbol: string;
  price: string;
  mark_price: string;
}
export interface ICoinPrice1AMUpdate extends TUpdateRecord<ICoinPrice1AM> {}

export interface ICoinPrice1AMDetail extends Pick<ICoinPrice1AM, "symbol"> {}

export interface ICoinPrice1AMMap extends Record<string, ICoinPrice1AM> {}
