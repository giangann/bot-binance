"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAutoActiveConfigTableAddColsSymbolMaxPnlStartSymbolMaxPnlThreshold1725156134523 = void 0;
const typeorm_1 = require("typeorm");
class UpdateAutoActiveConfigTableAddColsSymbolMaxPnlStartSymbolMaxPnlThreshold1725156134523 {
    async up(queryRunner) {
        await queryRunner.addColumns("auto_active_config", [
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
        ]);
    }
    async down(queryRunner) {
        await queryRunner.dropColumns("auto_active_config", ["symbol_max_pnl_start", "symbol_max_pnl_threshold"]);
    }
}
exports.UpdateAutoActiveConfigTableAddColsSymbolMaxPnlStartSymbolMaxPnlThreshold1725156134523 = UpdateAutoActiveConfigTableAddColsSymbolMaxPnlStartSymbolMaxPnlThreshold1725156134523;
