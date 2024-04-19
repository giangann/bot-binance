import {
  IMarketOrderChainCreate,
  IMarketOrderChainUpdate,
  TOrderChainStatus,
} from "market-order-chain.interface";
import { getRepository } from "typeorm";
import { MarketOrderChain } from "../entities/market-order-chain.entity";

const list = async (params?: { status: TOrderChainStatus }) => {
  const status = params?.status;

  const repo = getRepository(MarketOrderChain)
    .createQueryBuilder("market_order_chains")
    .leftJoinAndSelect("market_order_chains.order_pieces", "pieces");

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
    .where("market_order_chains.id = :id", { id });
  const orderChain = await repo.getOne();
  return orderChain
};

const create = async (params: IMarketOrderChainCreate) => {
  const createdRecord = await getRepository(MarketOrderChain).save(params);
  return createdRecord;
};

const update = async (params: IMarketOrderChainUpdate) => {
  const filtered = { id: params.id };
  delete params.id;
  const repo = getRepository(MarketOrderChain);
  const updateRes = await repo.update(filtered, params);
  return updateRes;
};

export default { create, list, update, detail };
