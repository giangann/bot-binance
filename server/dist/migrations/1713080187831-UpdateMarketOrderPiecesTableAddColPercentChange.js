"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMarketOrderPiecesTableAddColPercentChange1713080187831 = void 0;
const typeorm_1 = require("typeorm");
class UpdateMarketOrderPiecesTableAddColPercentChange1713080187831 {
    async up(queryRunner) {
        await queryRunner.addColumns("market_order_pieces", [
            new typeorm_1.TableColumn({
                name: "percent_change",
                type: "varchar",
                isNullable: false,
            }),
        ]);
    }
    async down(queryRunner) {
        await queryRunner.dropColumn("market_order_pieces", "percent_change");
    }
}
exports.UpdateMarketOrderPiecesTableAddColPercentChange1713080187831 = UpdateMarketOrderPiecesTableAddColPercentChange1713080187831;
