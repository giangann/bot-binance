"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stackTraceShorter = exports.errorToString = void 0;
const logger_config_1 = require("../loaders/logger.config");
const saveError = (error) => {
    if (error instanceof Error) {
        const content = errorToString(error);
        logger_config_1.logger.error(content);
    }
    else {
        const errorKeys = Object.keys(error);
        const errorProperties = Object.getOwnPropertyNames(error);
        const content = `Uncommon Error Exception with Keys: ${errorKeys} --and-- Properties: ${errorProperties}`;
        logger_config_1.logger.error(content);
    }
};
const saveErrorAndClg = (error) => {
    saveError(error);
    console.log(error);
};
const saveDebug = (content) => {
    logger_config_1.logger.debug(content);
};
const saveDebugAndClg = (content) => {
    saveDebug(content);
    console.log(content);
};
function errorToString(err) {
    const { name, message, cause, stack } = err;
    const shortStackTrace = stackTraceShorter(stack);
    return `NAME: ${name} | MESSAGE: ${message} | CAUSE: ${cause} | STACK: ${shortStackTrace}`;
}
exports.errorToString = errorToString;
function stackTraceShorter(trace) {
    const traceArr = trace.split("\n    ");
    const firstTrace = traceArr[traceArr.length - 1];
    const secondTrace = traceArr[traceArr.length - 2];
    const thirdTrace = traceArr[traceArr.length - 3];
    return `${firstTrace}  -  ${secondTrace}  -  ${thirdTrace}`;
}
exports.stackTraceShorter = stackTraceShorter;
exports.default = { saveError, saveDebug, saveDebugAndClg, saveErrorAndClg };
