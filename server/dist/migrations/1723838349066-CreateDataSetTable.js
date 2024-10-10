"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateDataSetTable1723838349066 = void 0;
const typeorm_1 = require("typeorm");
class CreateDataSetTable1723838349066 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: "datasets",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isGenerated: true,
                    generationStrategy: "increment",
                    isPrimary: true,
                },
                {
                    name: "name",
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
    }
    async down(queryRunner) {
        await queryRunner.dropTable("datasets");
    }
}
exports.CreateDataSetTable1723838349066 = CreateDataSetTable1723838349066;
