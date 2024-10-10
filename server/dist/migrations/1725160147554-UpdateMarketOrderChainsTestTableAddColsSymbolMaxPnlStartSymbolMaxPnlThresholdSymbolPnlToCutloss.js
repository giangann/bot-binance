"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMarketOrderChainsTestTableAddColsSymbolMaxPnlStartSymbolMaxPnlThresholdSymbolPnlToCutloss1725160147554 = void 0;
const typeorm_1 = require("typeorm");
class UpdateMarketOrderChainsTestTableAddColsSymbolMaxPnlStartSymbolMaxPnlThresholdSymbolPnlToCutloss1725160147554 {
    async up(queryRunner) {
        await queryRunner.addColumns("market_order_chains_test", [
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
            new typeorm_1.TableColumn({
                name: "symbol_pnl_to_cutloss",
                type: "varchar",
                isNullable: false,
            }),
        ]);
    }
    async down(queryRunner) {
        await queryRunner.dropColumns("market_order_chains_test", ["symbol_max_pnl_start", "symbol_max_pnl_threshold", "symbol_pnl_to_cutloss"]);
    }
}
exports.UpdateMarketOrderChainsTestTableAddColsSymbolMaxPnlStartSymbolMaxPnlThresholdSymbolPnlToCutloss1725160147554 = UpdateMarketOrderChainsTestTableAddColsSymbolMaxPnlStartSymbolMaxPnlThresholdSymbolPnlToCutloss1725160147554;
