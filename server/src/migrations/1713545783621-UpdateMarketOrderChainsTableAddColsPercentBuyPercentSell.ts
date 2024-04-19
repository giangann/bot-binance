import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class UpdateMarketOrderChainsTableAddColsPercentBuyPercentSell1713545783621
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns("market_order_chains", [
      new TableColumn({
        name: "percent_to_buy",
        type: "varchar",
        isNullable: false,
      }),
      new TableColumn({
        name: "percent_to_sell",
        type: "varchar",
        isNullable: false,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns("market_order_chains", [
      "percent_to_buy",
      "percent_to_sell",
    ]);
  }
}
