import { UpdateResult, getRepository } from "typeorm";
import { AutoActiveConfig } from "../entities/auto-active-config.entity";
import { IAutoActiveConfigUpdate } from "../interfaces/auto-active-config.interface";
import moment from "moment";

const getOne = async () => {
  const repo = getRepository(AutoActiveConfig).createQueryBuilder();
  const record = await repo.getOne();
  return record;
};

const updateOne = async (
  params: Omit<IAutoActiveConfigUpdate, "id">
): Promise<UpdateResult> => {
  const repo = getRepository(AutoActiveConfig);

  const record = await repo.findOne();
  if (!record) throw new Error("Empty table");

  const id = record.id;
  params.updatedAt = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");
  const updatedRecord = await repo.update(id, params);

  console.log(updatedRecord);
  return updatedRecord;
};
export default { getOne, updateOne };