"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateMarketOrderPiecesTable1713015709928 = void 0;
const typeorm_1 = require("typeorm");
class CreateMarketOrderPiecesTable1713015709928 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: "market_order_pieces",
            columns: [
                {
                    name: "id",
                    type: "varchar",
                    isGenerated: false,
                    isPrimary: true,
                },
                {
                    name: "timestamp",
                    type: "varchar",
                    default: `${Date.now()}`,
                    isNullable: true,
                },
                {
                    name: "market_order_chains_id",
                    type: "int",
                    isNullable: false,
                },
                {
                    name: "total_balance",
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
        await queryRunner.createForeignKey("market_order_pieces", new typeorm_1.TableForeignKey({
            columnNames: ["market_order_chains_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "market_order_chains",
            onDelete: "CASCADE",
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropTable("market_order_pieces");
    }
}
exports.CreateMarketOrderPiecesTable1713015709928 = CreateMarketOrderPiecesTable1713015709928;
