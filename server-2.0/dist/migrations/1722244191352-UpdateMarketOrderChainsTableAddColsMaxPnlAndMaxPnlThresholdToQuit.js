"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMarketOrderChainsTableAddColsMaxPnlAndMaxPnlThresholdToQuit1722244191352 = void 0;
const typeorm_1 = require("typeorm");
class UpdateMarketOrderChainsTableAddColsMaxPnlAndMaxPnlThresholdToQuit1722244191352 {
    async up(queryRunner) {
        await queryRunner.addColumns("market_order_chains", [
            new typeorm_1.TableColumn({
                name: "max_pnl_start",
                type: "varchar",
                isNullable: false,
            }),
            new typeorm_1.TableColumn({
                name: "max_pnl_threshold_to_quit",
                type: "varchar",
                isNullable: false,
            }),
        ]);
    }
    async down(queryRunner) {
        await queryRunner.dropColumns("market_order_chains", [
            "max_pnl_start",
            "max_pnl_threshold_to_quit",
        ]);
    }
}
exports.UpdateMarketOrderChainsTableAddColsMaxPnlAndMaxPnlThresholdToQuit1722244191352 = UpdateMarketOrderChainsTableAddColsMaxPnlAndMaxPnlThresholdToQuit1722244191352;
