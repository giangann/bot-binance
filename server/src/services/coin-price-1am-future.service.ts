import moment from "moment";
import { CoinPrice1AMFuture } from "../entities/coin-price-1am-future.entity";
import { getRepository } from "typeorm";
import {
  ICoinPrice1AMCreate,
  ICoinPrice1AMDetail,
  ICoinPrice1AMUpdate,
} from "../interfaces/coin-price-1am.interface";

const list = async () => {
  const coinRepo =
    getRepository(CoinPrice1AMFuture).createQueryBuilder("coin_price_1am_future");
  const listCoinPrice = await coinRepo.getMany();

  return listCoinPrice;
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

  const updatedCoin = await getRepository(CoinPrice1AMFuture).update(
    filterParams,
    updateParams
  );
  return updatedCoin;
};

const detail = async (params: ICoinPrice1AMDetail) => {
  const coin = await getRepository(CoinPrice1AMFuture).findOne({
    symbol: params.symbol,
  });
  return coin;
};

const create = async (params: ICoinPrice1AMCreate) => {
  const createdCoin = await getRepository(CoinPrice1AMFuture).save(params);
  return createdCoin;
};

const truncate = async () => {
  const result = await getRepository(CoinPrice1AMFuture).clear();
  return result;
};

export default { list, update, detail, create, truncate };
