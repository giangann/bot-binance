"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCoinPrice1AmAddColMarkPrice1714323444802 = void 0;
const typeorm_1 = require("typeorm");
class UpdateCoinPrice1AmAddColMarkPrice1714323444802 {
    async up(queryRunner) {
        await queryRunner.addColumns("coin_price_1am", [
            new typeorm_1.TableColumn({
                name: "mark_price",
                type: "varchar",
                isNullable: true,
            }),
        ]);
    }
    async down(queryRunner) {
        await queryRunner.dropColumn('coin_price_1am', 'mark_price');
    }
}
exports.UpdateCoinPrice1AmAddColMarkPrice1714323444802 = UpdateCoinPrice1AmAddColMarkPrice1714323444802;
