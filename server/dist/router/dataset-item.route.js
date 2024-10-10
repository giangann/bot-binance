"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dataset_item_controller_1 = __importDefault(require("../controllers/dataset-item.controller"));
const datasetItemRoute = express_1.default.Router();
datasetItemRoute.delete("/:id", dataset_item_controller_1.default.remove);
exports.default = datasetItemRoute;
