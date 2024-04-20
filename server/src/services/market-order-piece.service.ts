import {
  IMarketOrderPieceCreate,
  IMarketOrderPieceList,
} from "market-order-piece.interface";
import { getRepository } from "typeorm";
import { MarketOrderPiece } from "../entities/market-order-piece.entity";
import moment from "moment";

const list = async (params?: IMarketOrderPieceList) => {
  const repo = getRepository(MarketOrderPiece)
    .createQueryBuilder("market_order_pieces")
    .leftJoinAndSelect("market_order_pieces.order_chain", "order_chain");

  let symbol = params?.symbol;
  if (symbol) {
    repo.andWhere("market_order_pieces.symbol = :symbol", { symbol });
  }
  let createdAt = params?.createdAt;
  if (createdAt) {
    repo.andWhere("market_order_pieces.createdAt >= :createdAt", { createdAt });
    repo.andWhere(
      "market_order_pieces.createdAt < :createdAt + interval 1 day",
      {
        createdAt,
      }
    );
  }

  const listRecord = await repo.getMany();
  return listRecord;
};

const create = async (params: IMarketOrderPieceCreate) => {
  const paramsWithDateTime: IMarketOrderPieceCreate = {
    ...params,
    createdAt: moment().format("YYYY-MM-DD hh:mm:ss"),
    updatedAt: moment().format("YYYY-MM-DD hh:mm:ss"),
  };
  const createdRecord = await getRepository(MarketOrderPiece).save(
    paramsWithDateTime
  );
  return createdRecord;
};

export default { list, create };
