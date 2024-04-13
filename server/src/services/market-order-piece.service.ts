import { IMarketOrderPieceCreate } from "market-order-piece.interface";
import { getRepository } from "typeorm";
import { MarketOrderPiece } from "../entities/market-order-piece.entity";

const list = async () => {
  const listRecord = await getRepository(MarketOrderPiece)
    .createQueryBuilder("market_order_pieces")
    .leftJoinAndSelect("market_order_pieces.order_chain", "order_chain")
    .getMany();
  return listRecord;
};

const create = async (params: IMarketOrderPieceCreate) => {
  const createdRecord = await getRepository(MarketOrderPiece).save(params);
  return createdRecord;
};

export default { list, create };
