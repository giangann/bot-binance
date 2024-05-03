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
const log_entity_1 = require("../entities/log.entity");
const typeorm_1 = require("typeorm");
const list = (params) => __awaiter(void 0, void 0, void 0, function* () {
    const repo = (0, typeorm_1.getRepository)(log_entity_1.Log).createQueryBuilder("logs");
    const chainId = params.market_order_chains_id;
    if (chainId) {
        repo.andWhere("logs.market_order_chains_id = :chainId", { chainId });
    }
    const data = yield repo.getMany();
    return data;
});
const create = (params) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const paramsWithDateTime = Object.assign(Object.assign({}, params), { createdAt: (0, moment_1.default)().format("YYYY-MM-DD hh:mm:ss"), updatedAt: (0, moment_1.default)().format("YYYY-MM-DD hh:mm:ss") });
        const createdRecord = yield (0, typeorm_1.getRepository)(log_entity_1.Log).save(paramsWithDateTime);
        return createdRecord;
    }
    catch (error) {
        throw error;
    }
});
exports.default = { list, create };
