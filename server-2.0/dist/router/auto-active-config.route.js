"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auto_active_config_controller_1 = __importDefault(require("../controllers/auto-active-config.controller"));
const autoActiveConfigRoute = express_1.default.Router();
autoActiveConfigRoute.get("/get-one", auto_active_config_controller_1.default.getOne);
autoActiveConfigRoute.put("/update-one", auto_active_config_controller_1.default.updateOne);
exports.default = autoActiveConfigRoute;
