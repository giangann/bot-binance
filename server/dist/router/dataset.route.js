"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dataset_controller_1 = __importDefault(require("../controllers/dataset.controller"));
const datasetRoute = express_1.default.Router();
datasetRoute.get("/", dataset_controller_1.default.list);
datasetRoute.get("/:id", dataset_controller_1.default.detail);
datasetRoute.post("/", dataset_controller_1.default.create);
datasetRoute.delete("/:id", dataset_controller_1.default.remove);
datasetRoute.patch("/:id", dataset_controller_1.default.update);
exports.default = datasetRoute;
