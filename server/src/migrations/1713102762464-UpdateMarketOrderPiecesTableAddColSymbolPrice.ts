import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class UpdateMarketOrderPiecesTableAddColSymbolPrice1713102762464
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns("market_order_pieces", [
      new TableColumn({
        name: "price",
        type: "varchar",
        isNullable: false,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("market_order_pieces", "price");
  }
}
