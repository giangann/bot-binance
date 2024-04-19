"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
const express_1 = __importDefault(require("express"));
const userRoute = express_1.default.Router();
userRoute.get("/balance", user_controller_1.default.getBalance);
userRoute.get("/fetch-balance", user_controller_1.default.getBalance);
userRoute.get("/order-history", user_controller_1.default.getOrderHistory);
userRoute.get("/trade-history", user_controller_1.default.getTradeHistory);
exports.default = userRoute;
