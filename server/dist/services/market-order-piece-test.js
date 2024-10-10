"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
const typeorm_1 = require("typeorm");
const market_order_piece_test_entity_1 = require("../entities/market-order-piece-test.entity");
const list = async (params) => {
    const repo = (0, typeorm_1.getRepository)(market_order_piece_test_entity_1.MarketOrderPieceTest)
        .createQueryBuilder("market_order_pieces_test")
        .leftJoinAndSelect("market_order_pieces_test.order_chain_test", "order_chain_test");
    let symbol = params?.symbol;
    if (symbol) {
        repo.andWhere("market_order_pieces_test.symbol = :symbol", { symbol });
    }
    let createdAt = params?.createdAt;
    if (createdAt) {
        repo.andWhere("market_order_pieces_test.createdAt >= :createdAt", { createdAt });
        repo.andWhere("market_order_pieces_test.createdAt < :createdAt + interval 1 day", {
            createdAt,
        });
    }
    const listRecord = await repo.getMany();
    return listRecord;
};
const create = async (params) => {
    const paramsWithDateTime = {
        ...params,
        createdAt: (0, moment_1.default)().format("YYYY-MM-DD HH:mm:ss"),
        updatedAt: (0, moment_1.default)().format("YYYY-MM-DD HH:mm:ss"),
    };
    const createdRecord = await (0, typeorm_1.getRepository)(market_order_piece_test_entity_1.MarketOrderPieceTest).save(paramsWithDateTime);
    return createdRecord;
};
const createMany = async (params) => {
    const promises = params.map((param) => {
        return create(param);
    });
    const responses = await Promise.all(promises);
    return responses;
};
exports.default = { list, create, createMany };
