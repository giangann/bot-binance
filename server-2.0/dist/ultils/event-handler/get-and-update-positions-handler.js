"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAndUpdatePositionsEventHandler = void 0;
const logger_service_1 = __importDefault(require("../../services/logger.service"));
const helper_1 = require("../helper");
const getAndUpdatePositionsEventHandler = async (msg) => {
    try {
        // process stream data
        const msgString = msg.toString();
        const positionsResponse = JSON.parse(msgString);
        await (0, helper_1.fakeDelay)(Math.random());
        // process response
        const resultKey = "result";
        const errorKey = "error";
        if (resultKey in positionsResponse) {
            // update memory
            const positions = positionsResponse["result"];
            const positionsMap = (0, helper_1.positionsToMap)(positions);
            // update data memory
            global.positionsMap = positionsMap;
            // mark as able to run remain tick function
            global.isRunTick = true;
        }
        if (errorKey in positionsResponse) {
            // handle error
            const binanceError = positionsResponse[errorKey];
            const { code, msg } = binanceError;
            throw new Error(`Error occur in response of account.position resquest: CODE ${code}; MSG ${msg}`);
        }
    }
    catch (err) {
        logger_service_1.default.saveError(err);
    }
};
exports.getAndUpdatePositionsEventHandler = getAndUpdatePositionsEventHandler;
