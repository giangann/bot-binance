import { IMarketOrderChainCreate, IMarketOrderChainUpdate, TOrderChainStatus } from "../interfaces/market-order-chain.interface";
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

const getOpeningChain = async () => {
  const repo = getRepository(MarketOrderChain)
    .createQueryBuilder("market_order_chains")
    .leftJoinAndSelect("market_order_chains.order_pieces", "pieces")
    .orderBy("market_order_chains.createdAt", "DESC")
    .addOrderBy("pieces.createdAt", "DESC")
    .andWhere("market_order_chains.status = :status", { status: "open" });

  const openingChain = await repo.getOne();
  return openingChain;
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
  const createdRecord = await getRepository(MarketOrderChain).save(paramsWithDateTime);
  return createdRecord;
};

const update = async (params: IMarketOrderChainUpdate) => {
  const { id, ...updateParams } = params;
  params.updatedAt = moment().format("YYYY-MM-DD HH:mm:ss");
  const repo = getRepository(MarketOrderChain);
  const updateRes = await repo.update({ id }, updateParams);
  return updateRes;
};

const remove = async (id: number) => {
  const repo = getRepository(MarketOrderChain);

  const deletedRecord = await repo.delete({ id });

  return deletedRecord;
};

const markAllOpenChainsAsClosed = async (): Promise<number> => {
  const repository = getRepository(MarketOrderChain);

  // Fetch all records with status "open"
  const openOrders = await repository.find({ where: { status: "open" } });

  if (openOrders.length === 0) {
    console.log("No open orders to close.");
    return 0;
  }

  // Update status to "closed" and get the number of affected rows
  const result = await repository
    .createQueryBuilder()
    .update(MarketOrderChain)
    .set({ status: "closed" })
    .where("status = :status", { status: "open" })
    .execute();

  console.log(`Closed ${result.affected ?? 0} open orders.`);

  return result.affected ?? 0;
};

export default { create, list, getOpeningChain, update, remove, detail, markAllOpenChainsAsClosed };
