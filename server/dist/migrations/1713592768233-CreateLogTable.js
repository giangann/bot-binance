"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateLogTable1713592768233 = void 0;
const typeorm_1 = require("typeorm");
class CreateLogTable1713592768233 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: "logs",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isGenerated: true,
                    generationStrategy: "increment",
                    isPrimary: true,
                },
                {
                    name: "market_order_chains_id",
                    type: "int",
                    isNullable: false,
                },
                {
                    name: "message",
                    type: "varchar",
                    isNullable: false,
                },
                {
                    name: "type",
                    type: "varchar",
                    isNullable: false,
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
        await queryRunner.createForeignKey("logs", new typeorm_1.TableForeignKey({
            columnNames: ["market_order_chains_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "market_order_chains",
            onDelete: "CASCADE",
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropTable("logs");
    }
}
exports.CreateLogTable1713592768233 = CreateLogTable1713592768233;
