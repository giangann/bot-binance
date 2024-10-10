"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMarketOrderChainsTableAddColSymbolPnlToCutloss1725158033841 = void 0;
const typeorm_1 = require("typeorm");
class UpdateMarketOrderChainsTableAddColSymbolPnlToCutloss1725158033841 {
    async up(queryRunner) {
        await queryRunner.addColumn("market_order_chains", new typeorm_1.TableColumn({
            name: "symbol_pnl_to_cutloss",
            type: "varchar",
            isNullable: false,
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropColumn("market_order_chains", "symbol_pnl_to_cutloss");
    }
}
exports.UpdateMarketOrderChainsTableAddColSymbolPnlToCutloss1725158033841 = UpdateMarketOrderChainsTableAddColSymbolPnlToCutloss1725158033841;
