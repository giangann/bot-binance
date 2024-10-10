import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class UpdateMarketOrderPiecesTableAddColReason1725161207199 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "market_order_pieces",
      new TableColumn({
        name: "reason",
        type: "varchar",
        isNullable: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("market_order_pieces", "reason");
  }
}
