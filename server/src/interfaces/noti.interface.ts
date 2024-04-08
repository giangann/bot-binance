import { ObjWithId } from "common.interface";
import { TCreateRecord, TUpdateRecord } from "generic.type";
import { IUserRecord } from "user.interface";

export interface INotiRecord {
  id: string;
  from_user_id: number;
  to_user_id: number;
  content: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface INotiEntity extends INotiRecord {
  from_user: IUserRecord;
  to_user: IUserRecord;
}

export interface INotiRealtime {
  content: string;
  from_user: {
    username: string;
  };
}

export interface INotiCreate extends TCreateRecord<INotiRecord> {}
export interface INotiUpdate extends TUpdateRecord<INotiRecord> {}
export interface INotiDelete extends ObjWithId {}
