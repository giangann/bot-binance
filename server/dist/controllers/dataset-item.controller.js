"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dataset_item_service_1 = __importDefault(require("../services/dataset-item.service"));
const server_response_ultil_1 = require("../ultils/server-response.ultil");
const remove = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await dataset_item_service_1.default.remove(Number(id));
        if (result.affected === 0) {
            server_response_ultil_1.ServerResponse.error(res, "Dataset not found", 404);
        }
        else {
            server_response_ultil_1.ServerResponse.response(res, { message: "Dataset deleted successfully" });
        }
    }
    catch (error) {
        server_response_ultil_1.ServerResponse.error(res, error);
    }
};
exports.default = { remove };
