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
const typeorm_1 = require("typeorm");
const market_order_chain_entity_1 = require("../entities/market-order-chain.entity");
const list = (params) => __awaiter(void 0, void 0, void 0, function* () {
    const status = params === null || params === void 0 ? void 0 : params.status;
    const repo = (0, typeorm_1.getRepository)(market_order_chain_entity_1.MarketOrderChain)
        .createQueryBuilder("market_order_chains")
        .leftJoinAndSelect("market_order_chains.order_pieces", "pieces");
    if (status) {
        repo.andWhere("market_order_chains.status = :status", { status });
    }
    const listRecords = yield repo.getMany();
    return listRecords;
});
const create = (params) => __awaiter(void 0, void 0, void 0, function* () {
    const createdRecord = yield (0, typeorm_1.getRepository)(market_order_chain_entity_1.MarketOrderChain).save(params);
    return createdRecord;
});
const update = (params) => __awaiter(void 0, void 0, void 0, function* () {
    const filtered = { id: params.id };
    delete params.id;
    const repo = (0, typeorm_1.getRepository)(market_order_chain_entity_1.MarketOrderChain);
    const updateRes = yield repo.update(filtered, params);
    return updateRes;
});
exports.default = { create, list, update };
