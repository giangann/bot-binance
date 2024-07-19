"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCoinPrice1AMFutureTable1714582475104 = void 0;
const typeorm_1 = require("typeorm");
class CreateCoinPrice1AMFutureTable1714582475104 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: "coin_price_1am_future",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment",
                },
                {
                    name: "symbol",
                    type: "varchar",
                    isNullable: true,
                },
                {
                    name: "price",
                    type: "varchar",
                    isNullable: true,
                },
                {
                    name: "mark_price",
                    type: "varchar",
                    isNullable: true,
                },
                {
                    name: "createdAt",
                    type: "datetime",
                    default: "CURRENT_TIMESTAMP",
                },
                {
                    name: "updatedAt",
                    type: "datetime",
                    default: "CURRENT_TIMESTAMP",
                },
            ],
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropTable("coin_price_1am_future");
    }
}
exports.CreateCoinPrice1AMFutureTable1714582475104 = CreateCoinPrice1AMFutureTable1714582475104;
