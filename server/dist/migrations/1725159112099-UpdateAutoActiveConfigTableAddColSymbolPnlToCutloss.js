"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAutoActiveConfigTableAddColSymbolPnlToCutloss1725159112099 = void 0;
const typeorm_1 = require("typeorm");
class UpdateAutoActiveConfigTableAddColSymbolPnlToCutloss1725159112099 {
    async up(queryRunner) {
        await queryRunner.addColumn("auto_active_config", new typeorm_1.TableColumn({
            name: "symbol_pnl_to_cutloss",
            type: "varchar",
            isNullable: false,
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropColumn("auto_active_config", "symbol_pnl_to_cutloss");
    }
}
exports.UpdateAutoActiveConfigTableAddColSymbolPnlToCutloss1725159112099 = UpdateAutoActiveConfigTableAddColSymbolPnlToCutloss1725159112099;
