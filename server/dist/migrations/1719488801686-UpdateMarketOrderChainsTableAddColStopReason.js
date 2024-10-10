"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMarketOrderChainsTableAddColStopReason1719488801686 = void 0;
const typeorm_1 = require("typeorm");
class UpdateMarketOrderChainsTableAddColStopReason1719488801686 {
    async up(queryRunner) {
        await queryRunner.addColumn("market_order_chains", new typeorm_1.TableColumn({
            name: "stop_reason",
            type: "varchar",
            isNullable: true,
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropColumn("market_order_chains", "stop_reason");
    }
}
exports.UpdateMarketOrderChainsTableAddColStopReason1719488801686 = UpdateMarketOrderChainsTableAddColStopReason1719488801686;
