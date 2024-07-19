"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMarketOrderChainsTableAddColPercentFirstBuy1715694193872 = void 0;
const typeorm_1 = require("typeorm");
class UpdateMarketOrderChainsTableAddColPercentFirstBuy1715694193872 {
    async up(queryRunner) {
        await queryRunner.addColumn("market_order_chains", new typeorm_1.TableColumn({
            name: "percent_to_first_buy",
            type: "varchar",
            isNullable: false,
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropColumn("market_order_chains", "percent_to_first_buy");
    }
}
exports.UpdateMarketOrderChainsTableAddColPercentFirstBuy1715694193872 = UpdateMarketOrderChainsTableAddColPercentFirstBuy1715694193872;
