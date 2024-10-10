"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateMarketOrderPiecesTestTable1723837533453 = void 0;
const typeorm_1 = require("typeorm");
class CreateMarketOrderPiecesTestTable1723837533453 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: "market_order_pieces_test",
            columns: [
                {
                    name: "id",
                    type: "varchar",
                    length: "255",
                    isPrimary: true,
                    isNullable: false,
                },
                {
                    name: "timestamp",
                    type: "timestamp",
                    default: "CURRENT_TIMESTAMP",
                    isNullable: false,
                },
                {
                    name: "market_order_chains_test_id",
                    type: "int",
                    isNullable: false,
                },
                {
                    name: "total_balance",
                    type: "varchar",
                    length: "255",
                    isNullable: false,
                },
                {
                    name: "createdAt",
                    type: "datetime",
                    default: "CURRENT_TIMESTAMP",
                    isNullable: true,
                },
                {
                    name: "updatedAt",
                    type: "datetime",
                    default: "CURRENT_TIMESTAMP",
                    onUpdate: "CURRENT_TIMESTAMP",
                    isNullable: false,
                },
                {
                    name: "percent_change",
                    type: "varchar",
                    length: "255",
                    isNullable: false,
                },
                {
                    name: "price",
                    type: "varchar",
                    length: "255",
                    isNullable: false,
                },
                {
                    name: "symbol",
                    type: "varchar",
                    length: "255",
                    isNullable: false,
                },
                {
                    name: "direction",
                    type: "varchar",
                    length: "255",
                    isNullable: false,
                },
                {
                    name: "quantity",
                    type: "varchar",
                    length: "255",
                    isNullable: false,
                },
                {
                    name: "transaction_size",
                    type: "varchar",
                    length: "255",
                    isNullable: false,
                },
            ],
        }));
        await queryRunner.createForeignKey("market_order_pieces_test", new typeorm_1.TableForeignKey({
            columnNames: ["market_order_chains_test_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "market_order_chains_test",
            onDelete: "CASCADE",
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropTable("market_order_pieces_test");
    }
}
exports.CreateMarketOrderPiecesTestTable1723837533453 = CreateMarketOrderPiecesTestTable1723837533453;
