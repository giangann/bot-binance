"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMarketOrderChainsTableAddColStartReason1722356384352 = void 0;
const typeorm_1 = require("typeorm");
class UpdateMarketOrderChainsTableAddColStartReason1722356384352 {
    async up(queryRunner) {
        await queryRunner.addColumn("market_order_chains", new typeorm_1.TableColumn({
            name: "start_reason",
            type: "varchar",
            isNullable: true,
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropColumn("market_order_chains", "start_reason");
    }
}
exports.UpdateMarketOrderChainsTableAddColStartReason1722356384352 = UpdateMarketOrderChainsTableAddColStartReason1722356384352;
