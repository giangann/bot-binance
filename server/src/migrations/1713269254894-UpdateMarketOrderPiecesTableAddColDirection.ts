import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class UpdateMarketOrderPiecesTableAddColDirection1713269254894
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns("market_order_pieces", [
      new TableColumn({
        name: "direction",
        type: "varchar",
        isNullable: false,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("market_order_pieces", "direction");
  }
}
