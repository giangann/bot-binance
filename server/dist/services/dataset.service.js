"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
const typeorm_1 = require("typeorm");
const dataset_item_entity_1 = require("../entities/dataset-item.entity");
const dataset_entity_1 = require("../entities/dataset.entity");
const list = async () => {
    const repo = (0, typeorm_1.getRepository)(dataset_entity_1.Dataset).createQueryBuilder("datasets");
    repo.leftJoinAndSelect("datasets.dataset_items", "items");
    repo.addOrderBy("datasets.createdAt", "DESC");
    repo.addOrderBy("items.order", "ASC");
    const data = await repo.getMany();
    return data;
};
const detail = async (id) => {
    const datasetRepo = (0, typeorm_1.getRepository)(dataset_entity_1.Dataset);
    // Create a query builder for Dataset
    const queryBuilder = datasetRepo
        .createQueryBuilder("datasets")
        .leftJoinAndSelect("datasets.dataset_items", "items")
        .where("datasets.id = :id", { id })
        .addOrderBy("items.order", "ASC");
    // Execute the query and get the result
    const dataset = await queryBuilder.getOne();
    if (!dataset) {
        throw new Error("Dataset not found");
    }
    return dataset;
};
const create = async (params) => {
    const datasetRepo = (0, typeorm_1.getRepository)(dataset_entity_1.Dataset);
    const currentTime = (0, moment_1.default)().format("YYYY-MM-DD HH:mm:ss");
    // Create a new Dataset entity with timestamps
    const dataset = datasetRepo.create({
        ...params,
        createdAt: currentTime,
        updatedAt: currentTime,
    });
    // If dataset_items are present, manually create the related items with timestamps
    if (params.dataset_items && params.dataset_items.length > 0) {
        dataset.dataset_items = params.dataset_items.map((item) => {
            const datasetItem = new dataset_item_entity_1.DatasetItem();
            datasetItem.symbol = item.symbol;
            // @ts-ignore
            datasetItem.ticker_price = item.ticker_price;
            // @ts-ignore
            datasetItem.market_price = item.market_price;
            datasetItem.order = item.order;
            datasetItem.createdAt = currentTime;
            datasetItem.updatedAt = currentTime;
            return datasetItem;
        });
    }
    // Save dataset along with its related dataset_items
    const createdDataset = await datasetRepo.save(dataset);
    return createdDataset;
};
const update = async (params) => {
    const { id, dataset_items, ...updateParams } = params;
    const datasetRepo = (0, typeorm_1.getRepository)(dataset_entity_1.Dataset);
    const datasetItemRepo = (0, typeorm_1.getRepository)(dataset_item_entity_1.DatasetItem);
    // Find the existing dataset
    const dataset = await datasetRepo.findOne({ where: { id }, relations: ["dataset_items"] });
    if (!dataset) {
        throw new Error("Dataset not found");
    }
    // Update the dataset fields
    Object.assign(dataset, updateParams, {
        updatedAt: (0, moment_1.default)().format("YYYY-MM-DD HH:mm:ss"),
    });
    // If dataset_items are present, update or create them
    if (dataset_items && dataset_items.length > 0) {
        // Map existing items by id for easier lookup
        const existingItemsMap = new Map();
        dataset.dataset_items.forEach((item) => existingItemsMap.set(item.id, item));
        for (const item of dataset_items) {
            // Type guard to check if item is of type IDatasetItemUpdate
            if ("id" in item) {
                const existingItem = existingItemsMap.get(item.id);
                if (existingItem) {
                    // Update existing item
                    Object.assign(existingItem, item, {
                        updatedAt: (0, moment_1.default)().format("YYYY-MM-DD HH:mm:ss"),
                    });
                }
            }
            else {
                // Create new item
                const newItem = datasetItemRepo.create({
                    ...item,
                    datasets_id: dataset.id,
                    createdAt: (0, moment_1.default)().format("YYYY-MM-DD HH:mm:ss"),
                    updatedAt: (0, moment_1.default)().format("YYYY-MM-DD HH:mm:ss"),
                });
                dataset.dataset_items.push(newItem);
            }
        }
    }
    // Save the updated dataset and its items
    const updatedDataset = await datasetRepo.save(dataset);
    return updatedDataset;
};
const remove = async (id) => {
    const repo = (0, typeorm_1.getRepository)(dataset_entity_1.Dataset);
    const deletedRecord = await repo.delete({ id });
    return deletedRecord;
};
exports.default = { list, detail, create, update, remove };
