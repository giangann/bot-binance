import {
  ICoinPrice1AMCreate,
  ICoinPrice1AMDetail,
  ICoinPrice1AMUpdate,
} from "coin-price-1am.interface";
import moment from "moment";
import { getRepository } from "typeorm";
import { CoinPrice1AM } from "../entities/coin-price-1am.entity";

const list = async () => {
  const coinRepo =
    getRepository(CoinPrice1AM).createQueryBuilder("coin_price_1am");
  const listCoinPrice = await coinRepo.getMany();

  return listCoinPrice;
};

const getAllSymbolsDB = async (): Promise<string[]> => {
  const listCoinPrice = await list();
  const symbols = listCoinPrice.map((coin) => coin.symbol);
  return symbols;
};

const detail = async (params: ICoinPrice1AMDetail) => {
  const coin = await getRepository(CoinPrice1AM).findOne({
    symbol: params.symbol,
  });
  return coin;
};

const create = async (params: ICoinPrice1AMCreate) => {
  const createdCoin = await getRepository(CoinPrice1AM).save(params);
  return createdCoin;
};

const update = async (params: ICoinPrice1AMUpdate) => {
  const updatedAt = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");
  const updatedCoin = await getRepository(CoinPrice1AM).update(
    { symbol: params.symbol },
    { price: params.price, updatedAt }
  );
  return updatedCoin;
};

export default { create, update, list, detail, getAllSymbolsDB };
