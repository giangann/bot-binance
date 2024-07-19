"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMarketOrderChainsTableAddColsPercentBuyPercentSell1713545783621 = void 0;
const typeorm_1 = require("typeorm");
class UpdateMarketOrderChainsTableAddColsPercentBuyPercentSell1713545783621 {
    async up(queryRunner) {
        await queryRunner.addColumns("market_order_chains", [
            new typeorm_1.TableColumn({
                name: "percent_to_buy",
                type: "varchar",
                isNullable: false,
            }),
            new typeorm_1.TableColumn({
                name: "percent_to_sell",
                type: "varchar",
                isNullable: false,
            }),
        ]);
    }
    async down(queryRunner) {
        await queryRunner.dropColumns("market_order_chains", [
            "percent_to_buy",
            "percent_to_sell",
        ]);
    }
}
exports.UpdateMarketOrderChainsTableAddColsPercentBuyPercentSell1713545783621 = UpdateMarketOrderChainsTableAddColsPercentBuyPercentSell1713545783621;
