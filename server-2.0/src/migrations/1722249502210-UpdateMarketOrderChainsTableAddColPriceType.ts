import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class UpdateMarketOrderChainsTableAddColPriceType1722249502210
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "market_order_chains",
      new TableColumn({
        name: "price_type",
        type: "varchar",
        isNullable: false,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("market_order_chains", "price_type");
  }
}
