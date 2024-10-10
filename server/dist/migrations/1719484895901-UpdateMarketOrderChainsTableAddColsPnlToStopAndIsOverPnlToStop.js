"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMarketOrderChainsTableAddColsPnlToStopAndIsOverPnlToStop1719484895901 = void 0;
const typeorm_1 = require("typeorm");
class UpdateMarketOrderChainsTableAddColsPnlToStopAndIsOverPnlToStop1719484895901 {
    async up(queryRunner) {
        await queryRunner.addColumns("market_order_chains", [
            new typeorm_1.TableColumn({
                name: "pnl_to_stop",
                type: "varchar",
                isNullable: false,
            }),
            new typeorm_1.TableColumn({
                name: "is_over_pnl_to_stop",
                type: "tinyint",
                isNullable: true,
                default: false,
            }),
        ]);
    }
    async down(queryRunner) {
        await queryRunner.dropColumns("market_order_chains", [
            "pnl_to_stop",
            "is_over_pnl_to_stop",
        ]);
    }
}
exports.UpdateMarketOrderChainsTableAddColsPnlToStopAndIsOverPnlToStop1719484895901 = UpdateMarketOrderChainsTableAddColsPnlToStopAndIsOverPnlToStop1719484895901;
