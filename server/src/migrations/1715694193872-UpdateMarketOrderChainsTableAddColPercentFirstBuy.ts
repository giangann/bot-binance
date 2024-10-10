import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class UpdateMarketOrderChainsTableAddColPercentFirstBuy1715694193872
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "market_order_chains",
      new TableColumn({
        name: "percent_to_first_buy",
        type: "varchar",
        isNullable: false,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("market_order_chains", "percent_to_first_buy");
  }
}
