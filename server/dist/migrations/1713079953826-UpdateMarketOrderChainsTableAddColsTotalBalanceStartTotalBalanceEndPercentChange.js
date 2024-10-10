"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMarketOrderChainsTableAddColsTotalBalanceStartTotalBalanceEndPercentChange1713079953826 = void 0;
const typeorm_1 = require("typeorm");
class UpdateMarketOrderChainsTableAddColsTotalBalanceStartTotalBalanceEndPercentChange1713079953826 {
    async up(queryRunner) {
        await queryRunner.addColumns("market_order_chains", [
            new typeorm_1.TableColumn({
                name: "total_balance_start",
                type: "varchar",
                isNullable: false,
            }),
            new typeorm_1.TableColumn({
                name: "total_balance_end",
                type: "varchar",
                isNullable: true,
            }),
            new typeorm_1.TableColumn({
                name: "percent_change",
                type: "varchar",
                isNullable: true,
            }),
        ]);
    }
    async down(queryRunner) {
        await queryRunner.dropColumns("market_order_chains", [
            "total_balance_start",
            "total_balance_end",
            "percent_change",
        ]);
    }
}
exports.UpdateMarketOrderChainsTableAddColsTotalBalanceStartTotalBalanceEndPercentChange1713079953826 = UpdateMarketOrderChainsTableAddColsTotalBalanceStartTotalBalanceEndPercentChange1713079953826;
