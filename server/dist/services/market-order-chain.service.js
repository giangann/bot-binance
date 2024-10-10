"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const market_order_chain_entity_1 = require("../entities/market-order-chain.entity");
const moment_1 = __importDefault(require("moment"));
const list = async (params) => {
    const status = params?.status;
    const repo = (0, typeorm_1.getRepository)(market_order_chain_entity_1.MarketOrderChain)
        .createQueryBuilder("market_order_chains")
        .leftJoinAndSelect("market_order_chains.order_pieces", "pieces")
        .orderBy("market_order_chains.createdAt", "DESC")
        .addOrderBy("pieces.createdAt", "DESC");
    if (status) {
        repo.andWhere("market_order_chains.status = :status", { status });
    }
    const listRecords = await repo.getMany();
    return listRecords;
};
const getOpeningChain = async () => {
    const repo = (0, typeorm_1.getRepository)(market_order_chain_entity_1.MarketOrderChain)
        .createQueryBuilder("market_order_chains")
        .leftJoinAndSelect("market_order_chains.order_pieces", "pieces")
        .orderBy("market_order_chains.createdAt", "DESC")
        .addOrderBy("pieces.createdAt", "DESC")
        .andWhere("market_order_chains.status = :status", { status: "open" });
    const openingChain = await repo.getOne();
    return openingChain;
};
const detail = async (id) => {
    const repo = (0, typeorm_1.getRepository)(market_order_chain_entity_1.MarketOrderChain)
        .createQueryBuilder("market_order_chains")
        .leftJoinAndSelect("market_order_chains.order_pieces", "order_pieces")
        .where("market_order_chains.id = :id", { id })
        .orderBy("order_pieces.createdAt", "DESC");
    const orderChain = await repo.getOne();
    return orderChain;
};
const create = async (params) => {
    const paramsWithDateTime = {
        ...params,
        createdAt: (0, moment_1.default)().format("YYYY-MM-DD HH:mm:ss"),
        updatedAt: (0, moment_1.default)().format("YYYY-MM-DD HH:mm:ss"),
    };
    const createdRecord = await (0, typeorm_1.getRepository)(market_order_chain_entity_1.MarketOrderChain).save(paramsWithDateTime);
    return createdRecord;
};
const update = async (params) => {
    const { id, ...updateParams } = params;
    params.updatedAt = (0, moment_1.default)().format("YYYY-MM-DD HH:mm:ss");
    const repo = (0, typeorm_1.getRepository)(market_order_chain_entity_1.MarketOrderChain);
    const updateRes = await repo.update({ id }, updateParams);
    return updateRes;
};
const remove = async (id) => {
    const repo = (0, typeorm_1.getRepository)(market_order_chain_entity_1.MarketOrderChain);
    const deletedRecord = await repo.delete({ id });
    return deletedRecord;
};
const markAllOpenChainsAsClosed = async () => {
    const repository = (0, typeorm_1.getRepository)(market_order_chain_entity_1.MarketOrderChain);
    // Fetch all records with status "open"
    const openOrders = await repository.find({ where: { status: "open" } });
    if (openOrders.length === 0) {
        console.log("No open orders to close.");
        return 0;
    }
    // Update status to "closed" and get the number of affected rows
    const result = await repository
        .createQueryBuilder()
        .update(market_order_chain_entity_1.MarketOrderChain)
        .set({ status: "closed" })
        .where("status = :status", { status: "open" })
        .execute();
    console.log(`Closed ${result.affected ?? 0} open orders.`);
    return result.affected ?? 0;
};
exports.default = { create, list, getOpeningChain, update, remove, detail, markAllOpenChainsAsClosed };
