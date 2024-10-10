"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const moment_1 = __importDefault(require("moment"));
const typeorm_1 = require("typeorm");
const coin_price_1am_future_entity_1 = require("../entities/coin-price-1am-future.entity");
const coin_price_1am_entity_1 = require("../entities/coin-price-1am.entity");
dotenv_1.default.config();
class CoinService {
    entity;
    tblName;
    constructor(isTestnet) {
        let isTestnetMode = isTestnet;
        if (isTestnetMode === undefined || isTestnetMode === null) {
            const binanceBaseUrl = process.env.BINANCE_BASE_URL;
            if (!binanceBaseUrl)
                throw new Error('BINANCE_BASE_URL not found in env');
            if (binanceBaseUrl.includes("testnet"))
                isTestnetMode = true;
            else
                isTestnetMode = false;
        }
        this.entity = isTestnetMode ? coin_price_1am_entity_1.CoinPrice1AM : coin_price_1am_future_entity_1.CoinPrice1AMFuture;
        this.tblName = isTestnetMode ? "coin_price_1am" : "coin_price_1am_future";
    }
    async list() {
        const coinRepo = (0, typeorm_1.getRepository)(this.entity).createQueryBuilder(this.tblName);
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
