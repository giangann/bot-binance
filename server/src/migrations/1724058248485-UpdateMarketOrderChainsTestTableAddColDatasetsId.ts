import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from "typeorm";

export class UpdateMarketOrderChainsTestTableAddColDatasetsId1724058248485 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "market_order_chains_test",
      new TableColumn({
        name: "datasets_id",
        type: "int",
        isNullable: false,
      })
    );

    await queryRunner.createForeignKey(
      "market_order_chains_test",
      new TableForeignKey({
        columnNames: ["datasets_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "datasets",
        onDelete: "CASCADE",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Get the table and foreign key to drop
    const table = await queryRunner.getTable("market_order_chains_test");
    const foreignKey = table!.foreignKeys.find((fk) => fk.columnNames.indexOf("datasets_id") !== -1);

    // Drop the foreign key first
    if (foreignKey) {
      await queryRunner.dropForeignKey("market_order_chains_test", foreignKey);
    }

    // Drop the column itself
    await queryRunner.dropColumn("market_order_chains_test", "datasets_id");
  }
}
