"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
const log_entity_1 = require("../entities/log.entity");
const typeorm_1 = require("typeorm");
const list = async (params) => {
    const repo = (0, typeorm_1.getRepository)(log_entity_1.Log).createQueryBuilder("logs");
    const chainId = params.market_order_chains_id;
    if (chainId) {
        repo.andWhere("logs.market_order_chains_id = :chainId", { chainId });
    }
    const data = await repo.getMany();
    return data;
};
const create = async (params) => {
    try {
        const paramsWithDateTime = {
            ...params,
            createdAt: (0, moment_1.default)().format("YYYY-MM-DD hh:mm:ss"),
            updatedAt: (0, moment_1.default)().format("YYYY-MM-DD hh:mm:ss"),
        };
        const createdRecord = await (0, typeorm_1.getRepository)(log_entity_1.Log).save(paramsWithDateTime);
        return createdRecord;
    }
    catch (error) {
        throw error;
    }
};
exports.default = { list, create };
