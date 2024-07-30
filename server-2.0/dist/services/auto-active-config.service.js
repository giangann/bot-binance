"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const auto_active_config_entity_1 = require("../entities/auto-active-config.entity");
const moment_1 = __importDefault(require("moment"));
const getOne = async () => {
    const repo = (0, typeorm_1.getRepository)(auto_active_config_entity_1.AutoActiveConfig).createQueryBuilder();
    const record = await repo.getOne();
    const { id, ...recordWithoutId } = record;
    return recordWithoutId;
};
const updateOne = async (params) => {
    const repo = (0, typeorm_1.getRepository)(auto_active_config_entity_1.AutoActiveConfig);
    const record = await repo.findOne();
    if (!record)
        throw new Error("Empty table");
    const id = record.id;
    params.updatedAt = (0, moment_1.default)(Date.now()).format("YYYY-MM-DD HH:mm:ss");
    const updatedRecord = await repo.update(id, params);
    console.log(updatedRecord);
    return updatedRecord;
};
exports.default = { getOne, updateOne };
