"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
const coin_price_1am_future_entity_1 = require("../entities/coin-price-1am-future.entity");
const typeorm_1 = require("typeorm");
const list = async () => {
    const coinRepo = (0, typeorm_1.getRepository)(coin_price_1am_future_entity_1.CoinPrice1AMFuture).createQueryBuilder("coin_price_1am_future");
    const listCoinPrice = await coinRepo.getMany();
    return listCoinPrice;
};
const update = async (params) => {
    let filterParams = { symbol: params.symbol };
    let updateParams = {
        updatedAt: (0, moment_1.default)(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
    };
    if (params.price) {
        updateParams["price"] = params.price;
    }
    if (params.mark_price) {
        updateParams["mark_price"] = params.mark_price;
    }
    const updatedCoin = await (0, typeorm_1.getRepository)(coin_price_1am_future_entity_1.CoinPrice1AMFuture).update(filterParams, updateParams);
    return updatedCoin;
};
const detail = async (params) => {
    const coin = await (0, typeorm_1.getRepository)(coin_price_1am_future_entity_1.CoinPrice1AMFuture).findOne({
        symbol: params.symbol,
    });
    return coin;
};
const create = async (params) => {
    const createdCoin = await (0, typeorm_1.getRepository)(coin_price_1am_future_entity_1.CoinPrice1AMFuture).save(params);
    return createdCoin;
};
const truncate = async () => {
    const result = await (0, typeorm_1.getRepository)(coin_price_1am_future_entity_1.CoinPrice1AMFuture).clear();
    return result;
};
exports.default = { list, update, detail, create, truncate };
