"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMarketOrderChainsTestTableAddColDatasetsId1724058248485 = void 0;
const typeorm_1 = require("typeorm");
class UpdateMarketOrderChainsTestTableAddColDatasetsId1724058248485 {
    async up(queryRunner) {
        await queryRunner.addColumn("market_order_chains_test", new typeorm_1.TableColumn({
            name: "datasets_id",
            type: "int",
            isNullable: false,
        }));
        await queryRunner.createForeignKey("market_order_chains_test", new typeorm_1.TableForeignKey({
            columnNames: ["datasets_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "datasets",
            onDelete: "CASCADE",
        }));
    }
    async down(queryRunner) {
        // Get the table and foreign key to drop
        const table = await queryRunner.getTable("market_order_chains_test");
        const foreignKey = table.foreignKeys.find((fk) => fk.columnNames.indexOf("datasets_id") !== -1);
        // Drop the foreign key first
        if (foreignKey) {
            await queryRunner.dropForeignKey("market_order_chains_test", foreignKey);
        }
        // Drop the column itself
        await queryRunner.dropColumn("market_order_chains_test", "datasets_id");
    }
}
exports.UpdateMarketOrderChainsTestTableAddColDatasetsId1724058248485 = UpdateMarketOrderChainsTestTableAddColDatasetsId1724058248485;
