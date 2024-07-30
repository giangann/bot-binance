import moment from "moment";
import { UpdateResult, getRepository } from "typeorm";
import { AutoActiveConfig } from "../entities/auto-active-config.entity";
import { IAutoActiveConfigUpdateOne } from "../interfaces/auto-active-config.interface";

const getOne = async (): Promise<Omit<AutoActiveConfig, "id">> => {
  const repo = getRepository(AutoActiveConfig).createQueryBuilder();
  const record = await repo.getOne();
  const { id, ...recordWithoutId } = record;

  return recordWithoutId;
};

const updateOne = async (
  params: IAutoActiveConfigUpdateOne
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
