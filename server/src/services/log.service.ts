import { ILogCreate, ILogList } from "log.interface";
import moment from "moment";
import { Log } from "../entities/log.entity";
import { getRepository } from "typeorm";

const list = async (params: ILogList) => {
  const repo = getRepository(Log).createQueryBuilder("logs");

  const chainId = params.market_order_chains_id;
  if (chainId) {
    repo.andWhere("logs.market_order_chains_id = :chainId", { chainId });
  }

  const data = await repo.getMany();
  return data;
};

const create = async (params: ILogCreate) => {
  try {
    const paramsWithDateTime: ILogCreate = {
      ...params,
      createdAt: moment().format("YYYY-MM-DD hh:mm:ss"),
      updatedAt: moment().format("YYYY-MM-DD hh:mm:ss"),
    };
    const createdRecord = await getRepository(Log).save(paramsWithDateTime);
    return createdRecord;
  } catch (error) {
    throw error;
  }
};

export default { list, create };
