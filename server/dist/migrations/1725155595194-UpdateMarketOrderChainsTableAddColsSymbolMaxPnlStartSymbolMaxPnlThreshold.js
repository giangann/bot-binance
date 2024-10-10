"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMarketOrderChainsTableAddColsSymbolMaxPnlStartSymbolMaxPnlThreshold1725155595194 = void 0;
const typeorm_1 = require("typeorm");
class UpdateMarketOrderChainsTableAddColsSymbolMaxPnlStartSymbolMaxPnlThreshold1725155595194 {
    async up(queryRunner) {
        await queryRunner.addColumns("market_order_chains", [
            new typeorm_1.TableColumn({
                name: "symbol_max_pnl_start",
                type: "varchar",
                isNullable: false,
            }),
            new typeorm_1.TableColumn({
                name: "symbol_max_pnl_threshold",
                type: "varchar",
                isNullable: false,
            }),
        ]);
    }
    async down(queryRunner) {
        await queryRunner.dropColumns("market_order_chains", ["symbol_max_pnl_start", "symbol_max_pnl_threshold"]);
    }
}
exports.UpdateMarketOrderChainsTableAddColsSymbolMaxPnlStartSymbolMaxPnlThreshold1725155595194 = UpdateMarketOrderChainsTableAddColsSymbolMaxPnlStartSymbolMaxPnlThreshold1725155595194;
