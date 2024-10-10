import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class UpdateMarketOrderChainsTableAddColsPnlToStopAndIsOverPnlToStop1719484895901
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns("market_order_chains", [
      new TableColumn({
        name: "pnl_to_stop",
        type: "varchar",
        isNullable: false,
      }),
      new TableColumn({
        name: "is_over_pnl_to_stop",
        type: "tinyint",
        isNullable: true,
        default: false,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns("market_order_chains", [
      "pnl_to_stop",
      "is_over_pnl_to_stop",
    ]);
  }
}
