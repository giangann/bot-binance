import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class UpdateMarketOrderPiecesTableAddColsAmountTransactionSize1713546675657
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns("market_order_pieces", [
      new TableColumn({
        name: "amount",
        type: "varchar",
        isNullable: false,
      }),
      new TableColumn({
        name: "transaction_size",
        type: "varchar",
        isNullable: false,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns("market_order_pieces", [
      "amount",
      "transaction_size",
    ]);
  }
}
