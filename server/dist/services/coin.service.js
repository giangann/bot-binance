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
Object.defineProperty(exports, "__esModule", { value: true });
const coin_price_1am_entity_1 = require("../entities/coin-price-1am.entity");
const typeorm_1 = require("typeorm");
const create = (params) => __awaiter(void 0, void 0, void 0, function* () {
    const createdCoin = yield (0, typeorm_1.getRepository)(coin_price_1am_entity_1.CoinPrice1AM).save(params);
    return createdCoin;
});
const update = (params) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedCoin = yield (0, typeorm_1.getRepository)(coin_price_1am_entity_1.CoinPrice1AM).update({ symbol: params.symbol }, { price: params.price });
    return updatedCoin;
});
exports.default = { create, update };
