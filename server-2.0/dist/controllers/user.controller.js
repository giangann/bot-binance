"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const binance_service_1 = require("../services/binance.service");
const server_response_ultil_1 = require("../ultils/server-response.ultil");
const helper_1 = require("../ultils/helper");
const logger_service_1 = __importDefault(require("../services/logger.service"));
const getAccInfo = async (req, res) => {
    try {
        const accInfo = await (0, binance_service_1.getAccountInfo)();
        server_response_ultil_1.ServerResponse.response(res, accInfo);
    }
    catch (err) {
        logger_service_1.default.saveError(err);
        server_response_ultil_1.ServerResponse.error(res, err.message);
    }
};
const getPosition = async (req, res) => {
    try {
        // get position from binance service
        const allPositions = await (0, binance_service_1.getPositions)();
        const positionsNotZero = (0, helper_1.filterPositionsNotZero)(allPositions);
        server_response_ultil_1.ServerResponse.response(res, positionsNotZero);
    }
    catch (err) {
        logger_service_1.default.saveError(err);
        server_response_ultil_1.ServerResponse.error(res, err.message);
    }
};
exports.default = {
    getAccInfo,
    getPosition,
};
