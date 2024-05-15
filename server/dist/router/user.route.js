"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
const express_1 = __importDefault(require("express"));
const userRoute = express_1.default.Router();
userRoute.get("/order-history", user_controller_1.default.getOrderHistory);
userRoute.get("/trade-history", user_controller_1.default.getTradeHistory);
userRoute.get("/acc-info-axios", user_controller_1.default.getAccInfo);
userRoute.get("/acc-info-fetch", user_controller_1.default.getAccInfo);
userRoute.get("/position-info", user_controller_1.default.getPosition);
exports.default = userRoute;
