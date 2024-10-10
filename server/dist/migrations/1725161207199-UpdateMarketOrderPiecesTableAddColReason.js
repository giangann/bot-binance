"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMarketOrderPiecesTableAddColReason1725161207199 = void 0;
const typeorm_1 = require("typeorm");
class UpdateMarketOrderPiecesTableAddColReason1725161207199 {
    async up(queryRunner) {
        await queryRunner.addColumn("market_order_pieces", new typeorm_1.TableColumn({
            name: "reason",
            type: "varchar",
            isNullable: true,
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropColumn("market_order_pieces", "reason");
    }
}
exports.UpdateMarketOrderPiecesTableAddColReason1725161207199 = UpdateMarketOrderPiecesTableAddColReason1725161207199;
