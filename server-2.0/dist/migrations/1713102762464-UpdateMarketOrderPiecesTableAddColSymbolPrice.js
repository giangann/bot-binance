"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMarketOrderPiecesTableAddColSymbolPrice1713102762464 = void 0;
const typeorm_1 = require("typeorm");
class UpdateMarketOrderPiecesTableAddColSymbolPrice1713102762464 {
    async up(queryRunner) {
        await queryRunner.addColumns("market_order_pieces", [
            new typeorm_1.TableColumn({
                name: "price",
                type: "varchar",
                isNullable: false,
            }),
        ]);
    }
    async down(queryRunner) {
        await queryRunner.dropColumn("market_order_pieces", "price");
    }
}
exports.UpdateMarketOrderPiecesTableAddColSymbolPrice1713102762464 = UpdateMarketOrderPiecesTableAddColSymbolPrice1713102762464;
