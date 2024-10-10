import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class UpdateMarketOrderChainsTableAddColsMaxPnlAndMaxPnlThresholdToQuit1722244191352
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns("market_order_chains", [
      new TableColumn({
        name: "max_pnl_start",
        type: "varchar",
        isNullable: false,
      }),
      new TableColumn({
        name: "max_pnl_threshold_to_quit",
        type: "varchar",
        isNullable: false,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns("market_order_chains", [
      "max_pnl_start",
      "max_pnl_threshold_to_quit",
    ]);
  }
}
