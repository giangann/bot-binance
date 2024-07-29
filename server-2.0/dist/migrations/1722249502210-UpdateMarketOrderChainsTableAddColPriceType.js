"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMarketOrderChainsTableAddColPriceType1722249502210 = void 0;
const typeorm_1 = require("typeorm");
class UpdateMarketOrderChainsTableAddColPriceType1722249502210 {
    async up(queryRunner) {
        await queryRunner.addColumn("market_order_chains", new typeorm_1.TableColumn({
            name: "price_type",
            type: "varchar",
            isNullable: false,
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropColumn("market_order_chains", "price_type");
    }
}
exports.UpdateMarketOrderChainsTableAddColPriceType1722249502210 = UpdateMarketOrderChainsTableAddColPriceType1722249502210;
