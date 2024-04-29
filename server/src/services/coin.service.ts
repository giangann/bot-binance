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
  let filterParams = { symbol: params.symbol };

  let updateParams: ICoinPrice1AMUpdate = {
    updatedAt: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
  };
  if (params.price) {
    updateParams["price"] = params.price;
  }
  if (params.mark_price) {
    updateParams["mark_price"] = params.mark_price;
  }
  if (params.f_price) {
    updateParams["f_price"] = params.f_price;
  }
  if (params.f_mark_price) {
    updateParams["f_mark_price"] = params.f_mark_price;
  }

  const updatedCoin = await getRepository(CoinPrice1AM).update(
    filterParams,
    updateParams
  );
  return updatedCoin;
};

export default { create, update, list, detail, getAllSymbolsDB };
