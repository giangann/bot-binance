"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const winston_1 = __importDefault(require("winston"));
const moment_1 = __importDefault(require("moment"));
const { combine, printf, timestamp } = winston_1.default.format;
const customFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level}: ${message}`;
});
const errorLogger = winston_1.default.createLogger({
    format: combine(timestamp({ format: () => (0, moment_1.default)().format("YYYY-MM-DD HH:mm:ss") }), customFormat),
    transports: [
        new winston_1.default.transports.File({ filename: "logs/logger-error.log", level: "error" }),
    ],
});
const transports = [
    new winston_1.default.transports.File({ filename: "logs/combined.log", level: "info" }),
    new winston_1.default.transports.File({
        filename: "logs/error.log",
        level: "error",
    }),
    new winston_1.default.transports.File({
        filename: "logs/order-debug.log",
        level: "debug",
    }),
];
// Add error listeners to each transport
transports.forEach((transport) => {
    transport.on("error", (err) => {
        // Handle the error, e.g., send an alert, write to another log, etc.
        errorLogger.error(`Error writing to ${transport.name}: ${err.message}`, { error: err });
    });
});
exports.logger = winston_1.default.createLogger({
    format: combine(timestamp({ format: () => (0, moment_1.default)().format("YYYY-MM-DD HH:mm:ss") }), // Add timestamp
    customFormat // Apply custom format
    ),
    transports: transports,
});
