import { Not, getRepository } from "typeorm";
import { Noti } from "../entities/noti.entity";
import { INotiCreate, INotiRecord, INotiUpdate } from "noti.interface";

const list = async (params: Partial<INotiRecord>) => {
  const listNoti = await getRepository(Noti).find({ ...params });

  return listNoti;
};
const create = async (params: INotiCreate) => {
  const createdNoti = await getRepository(Noti).save({ ...params });

  return createdNoti;
};

const update = async (params: INotiUpdate) => {
  const updatedNoti = await getRepository(Noti).update(
    { id: params.id },
    { ...params }
  );
  return updatedNoti;
};

export default { create, update, list };
