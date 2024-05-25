"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const market_order_piece_entity_1 = require("../entities/market-order-piece.entity");
const moment_1 = __importDefault(require("moment"));
const list = async (params) => {
    const repo = (0, typeorm_1.getRepository)(market_order_piece_entity_1.MarketOrderPiece)
        .createQueryBuilder("market_order_pieces")
        .leftJoinAndSelect("market_order_pieces.order_chain", "order_chain");
    let symbol = params?.symbol;
    if (symbol) {
        repo.andWhere("market_order_pieces.symbol = :symbol", { symbol });
    }
    let createdAt = params?.createdAt;
    if (createdAt) {
        repo.andWhere("market_order_pieces.createdAt >= :createdAt", { createdAt });
        repo.andWhere("market_order_pieces.createdAt < :createdAt + interval 1 day", {
            createdAt,
        });
    }
    const listRecord = await repo.getMany();
    return listRecord;
};
const create = async (params) => {
    const paramsWithDateTime = {
        ...params,
        createdAt: (0, moment_1.default)().format("YYYY-MM-DD hh:mm:ss"),
        updatedAt: (0, moment_1.default)().format("YYYY-MM-DD hh:mm:ss"),
    };
    const createdRecord = await (0, typeorm_1.getRepository)(market_order_piece_entity_1.MarketOrderPiece).save(paramsWithDateTime);
    return createdRecord;
};
exports.default = { list, create };
