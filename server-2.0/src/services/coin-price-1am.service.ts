import dotenv from "dotenv";
import moment from "moment";
import { EntityTarget, getRepository } from "typeorm";
import { CoinPrice1AMFuture } from "../entities/coin-price-1am-future.entity";
import { CoinPrice1AM } from "../entities/coin-price-1am.entity";
import {
  ICoinPrice1AMCreate,
  ICoinPrice1AMDetail,
  ICoinPrice1AMUpdate,
} from "../interfaces/coin-price-1am.interface";
dotenv.config();

export default class CoinService {
  entity: EntityTarget<CoinPrice1AM | CoinPrice1AMFuture>;
  tblName: string;

  constructor(isTestnet?: boolean) {
    let isTestnetMode = isTestnet;
    if (isTestnetMode === undefined || isTestnetMode === null) {
      const binanceBaseUrl = process.env.BINANCE_BASE_URL;
      if (binanceBaseUrl.includes("testnet")) isTestnetMode = true;
      else isTestnetMode = false;
    }
    this.entity = isTestnetMode ? CoinPrice1AM : CoinPrice1AMFuture;
    this.tblName = isTestnetMode ? "coin_price_1am" : "coin_price_1am_future";
  }

  async list() {
    const coinRepo = getRepository(this.entity).createQueryBuilder(
      this.tblName
    );
    const listCoinPrice = await coinRepo.getMany();

    return listCoinPrice;
  }

  async update(params: ICoinPrice1AMUpdate) {
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

    const updatedCoin = await getRepository(this.entity).update(
      filterParams,
      updateParams
    );
    return updatedCoin;
  }

  async detail(params: ICoinPrice1AMDetail) {
    const coin = await getRepository(this.entity).findOne({
      symbol: params.symbol,
    });
    return coin;
  }

  async create(params: ICoinPrice1AMCreate) {
    const createdCoin = await getRepository(this.entity).save(params);
    return createdCoin;
  }

  async truncate() {
    const result = await getRepository(this.entity).clear();
    return result;
  }
}
