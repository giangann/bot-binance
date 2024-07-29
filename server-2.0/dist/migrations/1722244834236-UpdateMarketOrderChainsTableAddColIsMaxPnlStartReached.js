"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMarketOrderChainsTableAddColIsMaxPnlStartReached1722244834236 = void 0;
const typeorm_1 = require("typeorm");
class UpdateMarketOrderChainsTableAddColIsMaxPnlStartReached1722244834236 {
    async up(queryRunner) {
        await queryRunner.addColumn("market_order_chains", new typeorm_1.TableColumn({
            name: "is_max_pnl_start_reached",
            type: "tinyint",
            isNullable: false,
            default: false,
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropColumn("market_order_chains", "is_max_pnl_start_reached");
    }
}
exports.UpdateMarketOrderChainsTableAddColIsMaxPnlStartReached1722244834236 = UpdateMarketOrderChainsTableAddColIsMaxPnlStartReached1722244834236;
