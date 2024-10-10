"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMarketOrderPiecesTableAddColsAmountTransactionSize1713546675657 = void 0;
const typeorm_1 = require("typeorm");
class UpdateMarketOrderPiecesTableAddColsAmountTransactionSize1713546675657 {
    async up(queryRunner) {
        await queryRunner.addColumns("market_order_pieces", [
            new typeorm_1.TableColumn({
                name: "amount",
                type: "varchar",
                isNullable: false,
            }),
            new typeorm_1.TableColumn({
                name: "transaction_size",
                type: "varchar",
                isNullable: false,
            }),
        ]);
    }
    async down(queryRunner) {
        await queryRunner.dropColumns("market_order_pieces", [
            "amount",
            "transaction_size",
        ]);
    }
}
exports.UpdateMarketOrderPiecesTableAddColsAmountTransactionSize1713546675657 = UpdateMarketOrderPiecesTableAddColsAmountTransactionSize1713546675657;
