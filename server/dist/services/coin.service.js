"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
const typeorm_1 = require("typeorm");
const coin_price_1am_future_entity_1 = require("../entities/coin-price-1am-future.entity");
const coin_price_1am_entity_1 = require("../entities/coin-price-1am.entity");
class CoinService {
    constructor(isTestnet) {
        this.entity = isTestnet ? coin_price_1am_entity_1.CoinPrice1AM : coin_price_1am_future_entity_1.CoinPrice1AMFuture;
    }
    list() {
        return __awaiter(this, void 0, void 0, function* () {
            const coinRepo = (0, typeorm_1.getRepository)(this.entity).createQueryBuilder("coin_price_1am");
            const listCoinPrice = yield coinRepo.getMany();
            return listCoinPrice;
        });
    }
    update(params) {
        return __awaiter(this, void 0, void 0, function* () {
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
            const updatedCoin = yield (0, typeorm_1.getRepository)(this.entity).update(filterParams, updateParams);
            return updatedCoin;
        });
    }
    detail(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const coin = yield (0, typeorm_1.getRepository)(this.entity).findOne({
                symbol: params.symbol,
            });
            return coin;
        });
    }
    create(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const createdCoin = yield (0, typeorm_1.getRepository)(this.entity).save(params);
            return createdCoin;
        });
    }
}
exports.default = CoinService;
