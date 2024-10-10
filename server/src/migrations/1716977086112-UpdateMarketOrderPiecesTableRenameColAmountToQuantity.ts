import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateMarketOrderPiecesTableRenameColAmountToQuantity1716977086112
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameColumn("market_order_pieces", "amount", "quantity");
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameColumn("market_order_pieces", "quantity", "amount");
  }
}
