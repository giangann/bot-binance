"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMarketOrderPiecesTableAddColSymbol1713200917274 = void 0;
const typeorm_1 = require("typeorm");
class UpdateMarketOrderPiecesTableAddColSymbol1713200917274 {
    async up(queryRunner) {
        await queryRunner.addColumns("market_order_pieces", [
            new typeorm_1.TableColumn({
                name: "symbol",
                type: "varchar",
                isNullable: false,
            }),
        ]);
    }
    async down(queryRunner) {
        await queryRunner.dropColumn("market_order_pieces", "symbol");
    }
}
exports.UpdateMarketOrderPiecesTableAddColSymbol1713200917274 = UpdateMarketOrderPiecesTableAddColSymbol1713200917274;
