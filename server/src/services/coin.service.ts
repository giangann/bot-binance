import { CoinPrice1AM } from "coin-price-1am.entity";
import { ICoinPrice1AMCreate } from "coin-price-1am.interface";
import { getRepository } from "typeorm";

const create = async (params: ICoinPrice1AMCreate) => {
  const createdCoin = await getRepository(CoinPrice1AM).save(params);
  return createdCoin;
};

export default { create };
