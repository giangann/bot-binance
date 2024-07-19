"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMarketOrderChainsTableAddColsPriceStartPriceEnd1713102987849 = void 0;
const typeorm_1 = require("typeorm");
class UpdateMarketOrderChainsTableAddColsPriceStartPriceEnd1713102987849 {
    async up(queryRunner) {
        await queryRunner.addColumns("market_order_chains", [
            new typeorm_1.TableColumn({
                name: "price_start",
                type: "varchar",
                isNullable: false,
            }),
            new typeorm_1.TableColumn({
                name: "price_end",
                type: "varchar",
                isNullable: true,
            }),
        ]);
    }
    async down(queryRunner) {
        await queryRunner.dropColumns("market_order_chains", [
            "price_start",
            "price_end",
        ]);
    }
}
exports.UpdateMarketOrderChainsTableAddColsPriceStartPriceEnd1713102987849 = UpdateMarketOrderChainsTableAddColsPriceStartPriceEnd1713102987849;
