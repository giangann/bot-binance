"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dataset_service_1 = __importDefault(require("../services/dataset.service"));
const server_response_ultil_1 = require("../ultils/server-response.ultil");
const list = async (req, res) => {
    try {
        const datasets = await dataset_service_1.default.list();
        server_response_ultil_1.ServerResponse.response(res, datasets);
    }
    catch (err) {
        server_response_ultil_1.ServerResponse.error(res, err.message);
    }
};
const detail = async (req, res) => {
    try {
        const { id } = req.params;
        const dataset = await dataset_service_1.default.detail(Number(id));
        server_response_ultil_1.ServerResponse.response(res, dataset);
    }
    catch (error) {
        server_response_ultil_1.ServerResponse.error(res, error.message);
    }
};
// Create a new dataset
const create = async (req, res) => {
    try {
        const params = req.body;
        const createdDataset = await dataset_service_1.default.create(params);
        server_response_ultil_1.ServerResponse.response(res, createdDataset);
    }
    catch (err) {
        server_response_ultil_1.ServerResponse.error(res, err.message);
    }
};
const update = async (req, res) => {
    try {
        const { id } = req.params;
        const params = req.body;
        // Call the dataset service to handle the update logic
        const updatedDataset = await dataset_service_1.default.update({ id: Number(id), ...params });
        if (!updatedDataset) {
            server_response_ultil_1.ServerResponse.error(res, "Dataset not found", 404);
        }
        else {
            server_response_ultil_1.ServerResponse.response(res, updatedDataset);
        }
    }
    catch (err) {
        server_response_ultil_1.ServerResponse.error(res, err.message);
    }
};
// Delete a dataset
const remove = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await dataset_service_1.default.remove(Number(id));
        if (result.affected === 0) {
            server_response_ultil_1.ServerResponse.error(res, "Dataset not found", 404);
        }
        else {
            server_response_ultil_1.ServerResponse.response(res, { message: "Dataset deleted successfully" });
        }
    }
    catch (err) {
        server_response_ultil_1.ServerResponse.error(res, err.message);
    }
};
exports.default = { list, detail, create, update, remove };
