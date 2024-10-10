import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class UpdateMarketOrderPiecesTableAddColSymbol1713200917274
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns("market_order_pieces", [
      new TableColumn({
        name: "symbol",
        type: "varchar",
        isNullable: false,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("market_order_pieces", "symbol");
  }
}
