import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class UpdateMarketOrderChainsTableAddColsTotalBalanceStartTotalBalanceEndPercentChange1713079953826
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns("market_order_chains", [
      new TableColumn({
        name: "total_balance_start",
        type: "varchar",
        isNullable: false,
      }),
      new TableColumn({
        name: "total_balance_end",
        type: "varchar",
        isNullable: true,
      }),
      new TableColumn({
        name: "percent_change",
        type: "varchar",
        isNullable: true,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns("market_order_chains", [
      "total_balance_start",
      "total_balance_end",
      "percent_change",
    ]);
  }
}
