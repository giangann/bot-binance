import winston from "winston";
export const logger = winston.createLogger({
  format: winston.format.json(),
  // defaultMeta: { timestamp: new Date() },
  defaultMeta:{timestamp: new Date()},
  transports: [
    new winston.transports.File({ filename: "combined.log", level: "info" }),
    new winston.transports.File({
      filename: "error.log",
      level: "error",
    }),
    new winston.transports.File({
      filename: "order-debug.log",
      level: "debug",
    }),
  ],
  // levels: {
  //   levels: {
  //     error: 0,
  //     info: 2,
  //     debug: 5,
  //   },
  //   colors: {
  //     info: "blue",
  //     debug: "yellow",
  //     error: "red",
  //   },
  // },
});
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.json(),
    })
  );
}

winston.addColors({
  info: "blue",
  debug: "yellow",
  error: "red",
});
