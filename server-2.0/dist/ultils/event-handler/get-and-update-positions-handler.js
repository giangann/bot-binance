"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAndUpdatePositionsEventHandler = void 0;
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
        console.log(err);
    }
};
exports.getAndUpdatePositionsEventHandler = getAndUpdatePositionsEventHandler;
