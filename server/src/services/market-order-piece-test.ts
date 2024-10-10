import moment from "moment";
import { getRepository } from "typeorm";
import { MarketOrderPieceTest } from "../entities/market-order-piece-test.entity";
import { IMarketOrderPieceTestList } from "../interfaces/market-order-piece-test.interface";
import { IMarketOrderPieceTestCreate } from "../interfaces/market-order-piece-test.interface";

const list = async (params?: IMarketOrderPieceTestList) => {
  const repo = getRepository(MarketOrderPieceTest)
    .createQueryBuilder("market_order_pieces_test")
    .leftJoinAndSelect("market_order_pieces_test.order_chain_test", "order_chain_test");

  let symbol = params?.symbol;
  if (symbol) {
    repo.andWhere("market_order_pieces_test.symbol = :symbol", { symbol });
  }
  let createdAt = params?.createdAt;
  if (createdAt) {
    repo.andWhere("market_order_pieces_test.createdAt >= :createdAt", { createdAt });
    repo.andWhere("market_order_pieces_test.createdAt < :createdAt + interval 1 day", {
      createdAt,
    });
  }

  const listRecord = await repo.getMany();
  return listRecord;
};

const create = async (params: IMarketOrderPieceTestCreate) => {
  const paramsWithDateTime: IMarketOrderPieceTestCreate = {
    ...params,
    createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
    updatedAt: moment().format("YYYY-MM-DD HH:mm:ss"),
  };
  const createdRecord = await getRepository(MarketOrderPieceTest).save(paramsWithDateTime);
  return createdRecord;
};

const createMany = async (params: IMarketOrderPieceTestCreate[]) => {
  const promises = params.map((param) => {
    return create(param);
  });
  const responses = await Promise.all(promises);
  return responses;
};

export default { list, create, createMany };
