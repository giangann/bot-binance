"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
const typeorm_1 = require("typeorm");
const coin_price_1am_future_entity_1 = require("../entities/coin-price-1am-future.entity");
const coin_price_1am_entity_1 = require("../entities/coin-price-1am.entity");
class CoinService {
    entity;
    constructor(isTestnet) {
        this.entity = isTestnet ? coin_price_1am_entity_1.CoinPrice1AM : coin_price_1am_future_entity_1.CoinPrice1AMFuture;
    }
    async list() {
        const coinRepo = (0, typeorm_1.getRepository)(this.entity).createQueryBuilder("coin_price_1am");
        const listCoinPrice = await coinRepo.getMany();
        return listCoinPrice;
    }
    async update(params) {
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
        const updatedCoin = await (0, typeorm_1.getRepository)(this.entity).update(filterParams, updateParams);
        return updatedCoin;
    }
    async detail(params) {
        const coin = await (0, typeorm_1.getRepository)(this.entity).findOne({
            symbol: params.symbol,
        });
        return coin;
    }
    async create(params) {
        const createdCoin = await (0, typeorm_1.getRepository)(this.entity).save(params);
        return createdCoin;
    }
    async truncate() {
        const result = await (0, typeorm_1.getRepository)(this.entity).clear();
        return result;
    }
}
exports.default = CoinService;
