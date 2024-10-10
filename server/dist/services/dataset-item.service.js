"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const moment_1 = __importDefault(require("moment"));
const dataset_item_entity_1 = require("../entities/dataset-item.entity");
const list = async () => {
    const repo = (0, typeorm_1.getRepository)(dataset_item_entity_1.DatasetItem).createQueryBuilder("dataset_items");
    repo.leftJoinAndSelect("dataset_items.dataset", "dataset");
    const data = await repo.getMany();
    return data;
};
const create = async (params) => {
    const paramsWithDateTime = {
        ...params,
        createdAt: (0, moment_1.default)().format("YYYY-MM-DD HH:mm:ss"),
        updatedAt: (0, moment_1.default)().format("YYYY-MM-DD HH:mm:ss"),
    };
    const createdRecord = await (0, typeorm_1.getRepository)(dataset_item_entity_1.DatasetItem).save(paramsWithDateTime);
    return createdRecord;
};
const update = async (params) => {
    const repo = (0, typeorm_1.getRepository)(dataset_item_entity_1.DatasetItem);
    const { id, ...updateParams } = params;
    const paramsWithDateTime = {
        ...updateParams,
        updatedAt: (0, moment_1.default)().format("YYYY-MM-DD HH:mm:ss"),
    };
    const updatedRecord = await repo.update(id, paramsWithDateTime);
    return updatedRecord;
};
const remove = async (id) => {
    const repo = (0, typeorm_1.getRepository)(dataset_item_entity_1.DatasetItem);
    const deletedRecord = await repo.delete({ id });
    return deletedRecord;
};
exports.default = { list, create, update, remove };
