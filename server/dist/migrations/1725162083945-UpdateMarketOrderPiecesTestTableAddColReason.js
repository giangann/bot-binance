"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMarketOrderPiecesTestTableAddColReason1725162083945 = void 0;
const typeorm_1 = require("typeorm");
class UpdateMarketOrderPiecesTestTableAddColReason1725162083945 {
    async up(queryRunner) {
        await queryRunner.addColumn("market_order_pieces_test", new typeorm_1.TableColumn({
            name: "reason",
            type: "varchar",
            isNullable: true,
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropColumn("market_order_pieces_test", "reason");
    }
}
exports.UpdateMarketOrderPiecesTestTableAddColReason1725162083945 = UpdateMarketOrderPiecesTestTableAddColReason1725162083945;
