"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bot_controller_1 = __importDefault(require("../controllers/bot.controller"));
const botRoute = (0, express_1.Router)();
botRoute.post("/active", bot_controller_1.default.active);
botRoute.get("/quit", bot_controller_1.default.quit);
exports.default = botRoute;
