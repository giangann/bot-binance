import { CoinPrice1AM } from "../entities/coin-price-1am.entity";
import {
  ICoinPrice1AMCreate,
  ICoinPrice1AMUpdate,
} from "coin-price-1am.interface";
import { getRepository } from "typeorm";

const create = async (params: ICoinPrice1AMCreate) => {
  const createdCoin = await getRepository(CoinPrice1AM).save(params);
  return createdCoin;
};

const update = async (params: ICoinPrice1AMUpdate) => {
  const updatedCoin = await getRepository(CoinPrice1AM).update(
    { symbol: params.symbol },
    { price: params.price }
  );
  return updatedCoin;
};

export default { create, update };
