"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCoinPrice1AMTable1712595729219 = void 0;
const typeorm_1 = require("typeorm");
class CreateCoinPrice1AMTable1712595729219 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: "coin_price_1am",
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
        await queryRunner.dropTable("coin_price_1am");
    }
}
exports.CreateCoinPrice1AMTable1712595729219 = CreateCoinPrice1AMTable1712595729219;
