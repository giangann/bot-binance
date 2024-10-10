import winston from "winston";
import moment from "moment";

const { combine, printf, timestamp } = winston.format;

const customFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});
const errorLogger = winston.createLogger({
  format: combine(
    timestamp({ format: () => moment().format("YYYY-MM-DD HH:mm:ss") }),
    customFormat
  ),
  transports: [
    new winston.transports.File({ filename: "logs/logger-error.log", level: "error" }),
  ],
});
const transports = [
  new winston.transports.File({ filename: "logs/combined.log", level: "info" }),
  new winston.transports.File({
    filename: "logs/error.log",
    level: "error",
  }),
  new winston.transports.File({
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
export const logger = winston.createLogger({
  format: combine(
    timestamp({ format: () => moment().format("YYYY-MM-DD HH:mm:ss") }), // Add timestamp
    customFormat // Apply custom format
  ),
  transports: transports,
});
