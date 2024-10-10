import moment from "moment";
import { IMarketOrderChainTestCreate, IMarketOrderChainTestUpdate } from "../interfaces/market-order-chain-test.interface";
import { getRepository } from "typeorm";
import { MarketOrderChainTest } from "../entities/market-order-chain-test.entity";
import { TOrderChainStatus } from "../interfaces/market-order-chain.interface";

const list = async (params?: { status: TOrderChainStatus }) => {
  const status = params?.status;

  const repo = getRepository(MarketOrderChainTest)
    .createQueryBuilder("market_order_chains_test")
    .leftJoinAndSelect("market_order_chains_test.order_pieces_test", "order_pieces_test")
    .orderBy("market_order_chains_test.createdAt", "DESC")
    .addOrderBy("order_pieces_test.createdAt", "DESC");
  if (status) {
    repo.andWhere("market_order_chains_test.status = :status", { status });
  }
  const listRecords = await repo.getMany();
  return listRecords;
};

const getOpeningChain = async () => {
  const repo = getRepository(MarketOrderChainTest)
    .createQueryBuilder("market_order_chains_test")
    .leftJoinAndSelect("market_order_chains_test.order_pieces_test", "order_pieces_test")
    .orderBy("market_order_chains_test.createdAt", "DESC")
    .addOrderBy("order_pieces_test.createdAt", "DESC")
    .andWhere("market_order_chains_test.status = :status", { status: "open" });

  const openingChain = await repo.getOne();
  return openingChain;
};

const detail = async (id: number) => {
  const repo = getRepository(MarketOrderChainTest)
    .createQueryBuilder("market_order_chains_test")
    .leftJoinAndSelect("market_order_chains_test.order_pieces_test", "order_pieces_test")
    .where("market_order_chains_test.id = :id", { id })
    .orderBy("order_pieces_test.createdAt", "DESC");
  const orderChain = await repo.getOne();
  return orderChain;
};

const create = async (params: IMarketOrderChainTestCreate) => {
  const paramsWithDateTime: IMarketOrderChainTestCreate = {
    ...params,
    createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
    updatedAt: moment().format("YYYY-MM-DD HH:mm:ss"),
  };
  const createdRecord = await getRepository(MarketOrderChainTest).save(paramsWithDateTime);
  return createdRecord;
};

const update = async (params: IMarketOrderChainTestUpdate) => {
  const { id, ...updateParams } = params;
  params.updatedAt = moment().format("YYYY-MM-DD HH:mm:ss");
  const repo = getRepository(MarketOrderChainTest);
  const updateRes = await repo.update({ id }, updateParams);
  return updateRes;
};

const remove = async (id: number) => {
  const repo = getRepository(MarketOrderChainTest);

  const deletedRecord = await repo.delete({ id });

  return deletedRecord;
};

const markAllOpenChainsAsClosed = async (): Promise<number> => {
  const repository = getRepository(MarketOrderChainTest);

  // Fetch all records with status "open"
  const openOrders = await repository.find({ where: { status: "open" } });

  if (openOrders.length === 0) {
    console.log("No open orders to close.");
    return 0;
  }

  // Update status to "closed" and get the number of affected rows
  const result = await repository
    .createQueryBuilder()
    .update(MarketOrderChainTest)
    .set({ status: "closed" })
    .where("status = :status", { status: "open" })
    .execute();

  console.log(`Closed ${result.affected ?? 0} open orders.`);

  return result.affected ?? 0;
};

export default { create, list, getOpeningChain, update, remove, detail, markAllOpenChainsAsClosed };
