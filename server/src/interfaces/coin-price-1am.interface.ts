import { TCreateRecord } from "generic.type";

export interface ICoinPrice1AM {
  id: number;
  symbol: string;
  price: string;
  createdAt: string;
  updatedAt: string;
}
export interface ICoinPrice1AMCreate extends TCreateRecord<ICoinPrice1AM> {}
