"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const coin_price_1am_controller_1 = __importDefault(require("../controllers/coin-price-1am.controller"));
const express_1 = __importDefault(require("express"));
const coinPrice1amRoute = express_1.default.Router();
coinPrice1amRoute.get("/", coin_price_1am_controller_1.default.list);
exports.default = coinPrice1amRoute;
