import { getRepository } from "typeorm";
import moment from "moment";
import { DatasetItem } from "../entities/dataset-item.entity";
import { IDatasetItemCreate, IDatasetItemUpdate } from "../interfaces/dataset-item.interface";

const list = async () => {
  const repo = getRepository(DatasetItem).createQueryBuilder("dataset_items");
  repo.leftJoinAndSelect("dataset_items.dataset", "dataset");

  const data = await repo.getMany();
  return data;
};

const create = async (params: IDatasetItemCreate) => {
  const paramsWithDateTime: IDatasetItemCreate = {
    ...params,
    createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
    updatedAt: moment().format("YYYY-MM-DD HH:mm:ss"),
  };
  const createdRecord = await getRepository(DatasetItem).save(paramsWithDateTime);
  return createdRecord;
};

const update = async (params: IDatasetItemUpdate) => {
  const repo = getRepository(DatasetItem);
  const { id, ...updateParams } = params;
  const paramsWithDateTime = {
    ...updateParams,
    updatedAt: moment().format("YYYY-MM-DD HH:mm:ss"),
  };

  const updatedRecord = await repo.update(id, paramsWithDateTime);
  return updatedRecord;
};

const remove = async (id: number) => {
  const repo = getRepository(DatasetItem);

  const deletedRecord = await repo.delete({ id });

  return deletedRecord;
};

export default { list, create, update, remove };
