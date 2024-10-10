"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateMarketOrderChainsTable1713015637190 = void 0;
const typeorm_1 = require("typeorm");
class CreateMarketOrderChainsTable1713015637190 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: "market_order_chains",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isGenerated: true,
                    generationStrategy: "increment",
                    isPrimary: true,
                },
                {
                    name: "status",
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
        await queryRunner.dropTable("market_order_chains");
    }
}
exports.CreateMarketOrderChainsTable1713015637190 = CreateMarketOrderChainsTable1713015637190;
