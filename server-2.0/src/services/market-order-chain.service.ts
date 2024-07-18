import {
  IMarketOrderChainCreate,
  IMarketOrderChainUpdate,
  TOrderChainStatus,
} from "../interfaces/market-order-chain.interface";
import { getRepository } from "typeorm";
import { MarketOrderChain } from "../entities/market-order-chain.entity";
import moment from "moment";

const list = async (params?: { status: TOrderChainStatus }) => {
  const status = params?.status;

  const repo = getRepository(MarketOrderChain)
    .createQueryBuilder("market_order_chains")
    .leftJoinAndSelect("market_order_chains.order_pieces", "pieces")
    .orderBy("market_order_chains.createdAt", "DESC")
    .addOrderBy("pieces.createdAt", "DESC");
  if (status) {
    repo.andWhere("market_order_chains.status = :status", { status });
  }
  const listRecords = await repo.getMany();
  return listRecords;
};

const detail = async (id: number) => {
  const repo = getRepository(MarketOrderChain)
    .createQueryBuilder("market_order_chains")
    .leftJoinAndSelect("market_order_chains.order_pieces", "order_pieces")
    .where("market_order_chains.id = :id", { id })
    .orderBy("order_pieces.createdAt", "DESC");
  const orderChain = await repo.getOne();
  return orderChain;
};

const create = async (params: IMarketOrderChainCreate) => {
  const paramsWithDateTime: IMarketOrderChainCreate = {
    ...params,
    createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
    updatedAt: moment().format("YYYY-MM-DD HH:mm:ss"),
  };
  const createdRecord = await getRepository(MarketOrderChain).save(
    paramsWithDateTime
  );
  return createdRecord;
};

const update = async (params: IMarketOrderChainUpdate) => {
  const filtered = { id: params.id };
  delete params.id;
  params.updatedAt = moment().format("YYYY-MM-DD HH:mm:ss");
  const repo = getRepository(MarketOrderChain);
  const updateRes = await repo.update(filtered, params);
  return updateRes;
};

export default { create, list, update, detail };
