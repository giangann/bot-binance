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
const market_order_piece_entity_1 = require("../entities/market-order-piece.entity");
const list = (params) => __awaiter(void 0, void 0, void 0, function* () {
    const repo = (0, typeorm_1.getRepository)(market_order_piece_entity_1.MarketOrderPiece)
        .createQueryBuilder("market_order_pieces")
        .leftJoinAndSelect("market_order_pieces.order_chain", "order_chain");
    let symbol = params === null || params === void 0 ? void 0 : params.symbol;
    if (symbol) {
        repo.andWhere("market_order_pieces.symbol = :symbol", { symbol });
    }
    let createdAt = params === null || params === void 0 ? void 0 : params.createdAt;
    if (createdAt) {
        repo.andWhere("market_order_pieces.createdAt >= :createdAt", { createdAt });
        repo.andWhere("market_order_pieces.createdAt < :createdAt + interval 1 day", {
            createdAt,
        });
    }
    const listRecord = yield repo.getMany();
    return listRecord;
});
const create = (params) => __awaiter(void 0, void 0, void 0, function* () {
    const createdRecord = yield (0, typeorm_1.getRepository)(market_order_piece_entity_1.MarketOrderPiece).save(params);
    return createdRecord;
});
exports.default = { list, create };
