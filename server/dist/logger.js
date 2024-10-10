"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
const logger_config_1 = require("./loaders/logger.config");
const logger_service_1 = require("./services/logger.service");
class Logger {
    /**
     * log
     */
    log(message) {
        console.log(`[LOG]: ${message}`);
    }
    debug(message) {
        logger_config_1.logger.debug(message);
    }
    debugAndLog(message) {
        logger_config_1.logger.debug(message);
        console.log(`[LOG]: ${message}`);
    }
    saveError(error) {
        if (error instanceof Error) {
            const content = (0, logger_service_1.errorToString)(error);
            logger_config_1.logger.error(content);
        }
        else {
            const errorKeys = Object.keys(error);
            const errorProperties = Object.getOwnPropertyNames(error);
            const content = `Uncommon Error Exception with Keys: ${errorKeys} --and-- Properties: ${errorProperties}`;
            logger_config_1.logger.error(content);
        }
    }
}
exports.Logger = Logger;
