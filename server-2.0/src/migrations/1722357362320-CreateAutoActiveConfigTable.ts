import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateAutoActiveConfigTable1722357362320
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "auto_active_config",
        columns: [
          {
            name: "id",
            type: "int",
            isGenerated: true,
            generationStrategy: "increment",
            isPrimary: true,
          },
          {
            name: "auto_active_decrease_price",
            type: "varchar",
            isNullable: false,
          },
          {
            name: "max_pnl_start",
            type: "varchar",
            isNullable: false,
          },
          {
            name: "max_pnl_threshold_to_quit",
            type: "varchar",
            isNullable: false,
          },
          {
            name: "percent_to_buy",
            type: "varchar",
            isNullable: false,
          },
          {
            name: "percent_to_first_buy",
            type: "varchar",
            isNullable: false,
          },
          {
            name: "percent_to_sell",
            type: "varchar",
            isNullable: false,
          },
          {
            name: "pnl_to_stop",
            type: "varchar",
            isNullable: false,
          },
          {
            name: "price_type",
            type: "varchar",
            isNullable: false,
          },
          {
            name: "transaction_size_start",
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
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("auto_active_config");
  }
}
