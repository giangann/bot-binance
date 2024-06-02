"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMarketOrderPiecesTableRenameColAmountToQuantity1716977086112 = void 0;
class UpdateMarketOrderPiecesTableRenameColAmountToQuantity1716977086112 {
    async up(queryRunner) {
        await queryRunner.renameColumn("market_order_pieces", "amount", "quantity");
    }
    async down(queryRunner) {
        await queryRunner.renameColumn("market_order_pieces", "quantity", "amount");
    }
}
exports.UpdateMarketOrderPiecesTableRenameColAmountToQuantity1716977086112 = UpdateMarketOrderPiecesTableRenameColAmountToQuantity1716977086112;
