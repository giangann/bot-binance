import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateMarketOrderChainsTestTable1723837378466 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "market_order_chains_test",
        columns: [
          {
            name: "id",
            type: "int",
            isGenerated: true,
            generationStrategy: "increment",
            isPrimary: true,
          },
          {
            name: "is_max_pnl_start_reached",
            type: "tinyint",
            isNullable: false,
            default: false,
          },
          {
            name: "is_over_pnl_to_stop",
            type: "tinyint",
            isNullable: false,
            default: false,
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
            name: "percent_change",
            type: "varchar",
            isNullable: true,
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
            name: "price_end",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "price_start",
            type: "varchar",
            isNullable: false,
          },
          {
            name: "price_type",
            type: "varchar",
            isNullable: false,
          },
          {
            name: "start_reason",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "status",
            type: "varchar",
            isNullable: false,
          },
          {
            name: "stop_reason",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "total_balance_end",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "total_balance_start",
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
    await queryRunner.dropTable("market_order_chains_test");
  }
}
