"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDatabase = void 0;
const typeorm_1 = require("typeorm");
const connectDatabase = async () => {
    const connection = await (0, typeorm_1.createConnection)();
    await connection.runMigrations();
};
exports.connectDatabase = connectDatabase;
