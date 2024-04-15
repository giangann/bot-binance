import {
  IMarketOrderPieceCreate,
  IMarketOrderPieceList,
} from "market-order-piece.interface";
import { getRepository } from "typeorm";
import { MarketOrderPiece } from "../entities/market-order-piece.entity";

const list = async (params: IMarketOrderPieceList) => {
  let { symbol, createdAt } = params;
  const repo = getRepository(MarketOrderPiece)
    .createQueryBuilder("market_order_pieces")
    .leftJoinAndSelect("market_order_pieces.order_chain", "order_chain");

  if (symbol) {
    repo.where("market_order_pieces.symbol = :symbol", { symbol });
  }
  if (createdAt) {
    repo.andWhere('market_order_pieces.createdAt >= :createdAt', { createdAt });
    repo.andWhere('market_order_pieces.createdAt < :createdAt + interval 1 day', {
      createdAt,
    });
  }

  const listRecord = await repo.getMany();
  return listRecord;
};

const create = async (params: IMarketOrderPieceCreate) => {
  const createdRecord = await getRepository(MarketOrderPiece).save(params);
  return createdRecord;
};

export default { list, create };
