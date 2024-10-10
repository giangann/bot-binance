"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateDataSetItemsTable1723838540203 = void 0;
const typeorm_1 = require("typeorm");
class CreateDataSetItemsTable1723838540203 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: "dataset_items",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isGenerated: true,
                    generationStrategy: "increment",
                    isPrimary: true,
                },
                {
                    name: "symbol",
                    type: "varchar",
                    isNullable: false,
                },
                {
                    name: "ticker_price",
                    type: "varchar",
                    isNullable: true,
                },
                {
                    name: "market_price",
                    type: "varchar",
                    isNullable: true,
                },
                {
                    name: "order",
                    type: "int",
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
                {
                    name: "datasets_id",
                    type: "int",
                    isNullable: false,
                },
            ],
        }));
        await queryRunner.createForeignKey("dataset_items", new typeorm_1.TableForeignKey({
            columnNames: ["datasets_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "datasets",
            onDelete: "CASCADE",
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropTable("dataset_items");
    }
}
exports.CreateDataSetItemsTable1723838540203 = CreateDataSetItemsTable1723838540203;
