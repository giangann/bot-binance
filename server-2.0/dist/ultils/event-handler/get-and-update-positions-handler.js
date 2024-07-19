"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAndUpdatePositionsEventHandler = void 0;
const logger_service_1 = __importDefault(require("../../services/logger.service"));
const helper_1 = require("../helper");
const getAndUpdatePositionsEventHandler = (msg) => {
    try {
        // process stream data
        const msgString = msg.toString();
        const positionsResponse = JSON.parse(msgString);
        // process response
        const resultKey = "result";
        const errorKey = "error";
        if (resultKey in positionsResponse) {
            logger_service_1.default.saveDebugAndClg('position response successed!');
            const positions = positionsResponse["result"];
            const positionsMap = (0, helper_1.positionsToMap)(positions);
            // update data memory
            global.positionsMap = positionsMap;
        }
        if (errorKey in positionsResponse) {
            // handle error
            console.log(positionsResponse[errorKey]);
            throw new Error("Error occur in response of account.position resquest");
        }
    }
    catch (err) {
        logger_service_1.default.saveError(err);
    }
};
exports.getAndUpdatePositionsEventHandler = getAndUpdatePositionsEventHandler;
