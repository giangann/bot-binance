import { TUpdateRecord } from "generic.type";

export interface ICoinPrice1AM {
  id: number;
  symbol: string;
  price: string;
  createdAt: string;
  updatedAt: string;
}
export interface ICoinPrice1AMCreate {
  symbol: string;
  price: string;
}
export interface ICoinPrice1AMUpdate extends TUpdateRecord<ICoinPrice1AM> {}
