"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleTickError = exports.throwError = exports.errorToString = void 0;
// @ts-nocheck
const axios_1 = require("axios");
const helper_ultil_1 = require("./helper.ultil");
const logger_service_1 = __importDefault(require("../services/logger.service"));
// convert Node Error object to string
function errorToString(err) {
    const { name, message, cause, stack } = err;
    const shortStackTrace = (0, helper_ultil_1.stackTraceShorter)(stack);
    return `NAME: ${name} | MESSAGE: ${message} | CAUSE: ${cause} | STACK: ${shortStackTrace}`;
}
exports.errorToString = errorToString;
// validate error: all the error type to the same format as Node Error object
// constrain: AxiosError is instance of Error but not vice versa
function throwError(err, causeCustom) {
    // so keep the conditional's order:
    // 1. check if err is instance of AxiosError
    // 2. if err is not instance of AxiosError nnso check if instance of Error
    // 1.
    if (err instanceof axios_1.AxiosError) {
        // get error information as data from response of Axios request
        const responseData = err.response.data;
        // parse to message string
        const errMsg = JSON.stringify(responseData);
        // constructor new Error object
        const newErr = new Error(errMsg, { cause: causeCustom });
        throw newErr;
    }
    // 2.
    if (err instanceof Error) {
        const { cause } = err;
        if (!cause)
            err.cause = causeCustom;
        throw err;
    }
}
exports.throwError = throwError;
// 1. emit Error information to client
// 2. save Error information to error.log file
function handleTickError(err) {
    if (err instanceof Error) {
        global.wsServerGlob.emit("app-err", JSON.stringify(err.message));
    }
    else {
        // exception
        global.wsServerGlob.emit("app-err", "Uncommon Error Exception, view detail in error.log file");
    }
    logger_service_1.default.saveErrorLog(err);
}
exports.handleTickError = handleTickError;
