import { ObjWithId } from "common.interface";

export type TCreateRecord<TRecord extends ObjWithId> = Omit<TRecord, "id">;
export type TUpdateRecord<TRecord extends ObjWithId> = Partial<
  Omit<TRecord, "id"> & Pick<TRecord, "id">
>;
