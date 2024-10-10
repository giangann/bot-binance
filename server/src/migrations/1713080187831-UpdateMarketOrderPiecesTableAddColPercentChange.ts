import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class UpdateMarketOrderPiecesTableAddColPercentChange1713080187831
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns("market_order_pieces", [
      new TableColumn({
        name: "percent_change",
        type: "varchar",
        isNullable: false,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("market_order_pieces", "percent_change");
  }
}
