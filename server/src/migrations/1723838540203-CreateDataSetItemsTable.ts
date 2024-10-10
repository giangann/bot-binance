import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateDataSetItemsTable1723838540203 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "dataset_items",
        columns: [
          {
            name: "id",
            type: "int",
            isGenerated: true,
            generationStrategy: "increment",
            isPrimary: true,
          },
          {
            name: "symbol",
            type: "varchar",
            isNullable: false,
          },
          {
            name: "ticker_price",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "market_price",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "order",
            type: "int",
            isNullable: false,
          },
          {
            name: "createdAt",
            type: "datetime",
            default: "CURRENT_TIMESTAMP",
          },
          {
            name: "updatedAt",
            type: "datetime",
            default: "CURRENT_TIMESTAMP",
          },

          {
            name: "datasets_id",
            type: "int",
            isNullable: false,
          },
        ],
      })
    );

    await queryRunner.createForeignKey(
      "dataset_items",
      new TableForeignKey({
        columnNames: ["datasets_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "datasets",
        onDelete: "CASCADE",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("dataset_items");
  }
}
