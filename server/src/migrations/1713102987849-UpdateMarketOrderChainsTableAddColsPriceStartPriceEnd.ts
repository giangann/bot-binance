import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class UpdateMarketOrderChainsTableAddColsPriceStartPriceEnd1713102987849
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns("market_order_chains", [
      new TableColumn({
        name: "price_start",
        type: "varchar",
        isNullable: false,
      }),
      new TableColumn({
        name: "price_end",
        type: "varchar",
        isNullable: true,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns("market_order_chains", [
      "price_start",
      "price_end",
    ]);
  }
}
