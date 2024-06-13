"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const coin_controller_1 = __importDefault(require("../controllers/coin.controller"));
const coinRoute = express_1.default.Router();
coinRoute.get("/update-price", coin_controller_1.default.updatePrice);
exports.default = coinRoute;
