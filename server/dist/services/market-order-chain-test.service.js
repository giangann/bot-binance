"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
const typeorm_1 = require("typeorm");
const market_order_chain_test_entity_1 = require("../entities/market-order-chain-test.entity");
const list = async (params) => {
    const status = params?.status;
    const repo = (0, typeorm_1.getRepository)(market_order_chain_test_entity_1.MarketOrderChainTest)
        .createQueryBuilder("market_order_chains_test")
        .leftJoinAndSelect("market_order_chains_test.order_pieces_test", "order_pieces_test")
        .orderBy("market_order_chains_test.createdAt", "DESC")
        .addOrderBy("order_pieces_test.createdAt", "DESC");
    if (status) {
        repo.andWhere("market_order_chains_test.status = :status", { status });
    }
    const listRecords = await repo.getMany();
    return listRecords;
};
const getOpeningChain = async () => {
    const repo = (0, typeorm_1.getRepository)(market_order_chain_test_entity_1.MarketOrderChainTest)
        .createQueryBuilder("market_order_chains_test")
        .leftJoinAndSelect("market_order_chains_test.order_pieces_test", "order_pieces_test")
        .orderBy("market_order_chains_test.createdAt", "DESC")
        .addOrderBy("order_pieces_test.createdAt", "DESC")
        .andWhere("market_order_chains_test.status = :status", { status: "open" });
    const openingChain = await repo.getOne();
    return openingChain;
};
const detail = async (id) => {
    const repo = (0, typeorm_1.getRepository)(market_order_chain_test_entity_1.MarketOrderChainTest)
        .createQueryBuilder("market_order_chains_test")
        .leftJoinAndSelect("market_order_chains_test.order_pieces_test", "order_pieces_test")
        .where("market_order_chains_test.id = :id", { id })
        .orderBy("order_pieces_test.createdAt", "DESC");
    const orderChain = await repo.getOne();
    return orderChain;
};
const create = async (params) => {
    const paramsWithDateTime = {
        ...params,
        createdAt: (0, moment_1.default)().format("YYYY-MM-DD HH:mm:ss"),
        updatedAt: (0, moment_1.default)().format("YYYY-MM-DD HH:mm:ss"),
    };
    const createdRecord = await (0, typeorm_1.getRepository)(market_order_chain_test_entity_1.MarketOrderChainTest).save(paramsWithDateTime);
    return createdRecord;
};
const update = async (params) => {
    const { id, ...updateParams } = params;
    params.updatedAt = (0, moment_1.default)().format("YYYY-MM-DD HH:mm:ss");
    const repo = (0, typeorm_1.getRepository)(market_order_chain_test_entity_1.MarketOrderChainTest);
    const updateRes = await repo.update({ id }, updateParams);
    return updateRes;
};
const remove = async (id) => {
    const repo = (0, typeorm_1.getRepository)(market_order_chain_test_entity_1.MarketOrderChainTest);
    const deletedRecord = await repo.delete({ id });
    return deletedRecord;
};
const markAllOpenChainsAsClosed = async () => {
    const repository = (0, typeorm_1.getRepository)(market_order_chain_test_entity_1.MarketOrderChainTest);
    // Fetch all records with status "open"
    const openOrders = await repository.find({ where: { status: "open" } });
    if (openOrders.length === 0) {
        console.log("No open orders to close.");
        return 0;
    }
    // Update status to "closed" and get the number of affected rows
    const result = await repository
        .createQueryBuilder()
        .update(market_order_chain_test_entity_1.MarketOrderChainTest)
        .set({ status: "closed" })
        .where("status = :status", { status: "open" })
        .execute();
    console.log(`Closed ${result.affected ?? 0} open orders.`);
    return result.affected ?? 0;
};
exports.default = { create, list, getOpeningChain, update, remove, detail, markAllOpenChainsAsClosed };
