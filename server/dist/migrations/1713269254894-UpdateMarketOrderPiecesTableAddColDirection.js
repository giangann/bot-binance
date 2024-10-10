"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMarketOrderPiecesTableAddColDirection1713269254894 = void 0;
const typeorm_1 = require("typeorm");
class UpdateMarketOrderPiecesTableAddColDirection1713269254894 {
    async up(queryRunner) {
        await queryRunner.addColumns("market_order_pieces", [
            new typeorm_1.TableColumn({
                name: "direction",
                type: "varchar",
                isNullable: false,
            }),
        ]);
    }
    async down(queryRunner) {
        await queryRunner.dropColumn("market_order_pieces", "direction");
    }
}
exports.UpdateMarketOrderPiecesTableAddColDirection1713269254894 = UpdateMarketOrderPiecesTableAddColDirection1713269254894;
