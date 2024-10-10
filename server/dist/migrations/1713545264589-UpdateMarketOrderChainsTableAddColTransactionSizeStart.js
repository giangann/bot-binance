"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMarketOrderChainsTableAddColTransactionSizeStart1713545264589 = void 0;
const typeorm_1 = require("typeorm");
class UpdateMarketOrderChainsTableAddColTransactionSizeStart1713545264589 {
    async up(queryRunner) {
        await queryRunner.addColumns("market_order_chains", [
            new typeorm_1.TableColumn({
                name: "transaction_size_start",
                type: "int",
                isNullable: false,
            }),
        ]);
    }
    async down(queryRunner) {
        await queryRunner.dropColumn("market_order_chains", "transaction_size_start");
    }
}
exports.UpdateMarketOrderChainsTableAddColTransactionSizeStart1713545264589 = UpdateMarketOrderChainsTableAddColTransactionSizeStart1713545264589;
