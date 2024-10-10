import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class UpdateMarketOrderChainsTableAddColIsMaxPnlStartReached1722244834236
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "market_order_chains",
      new TableColumn({
        name: "is_max_pnl_start_reached",
        type: "tinyint",
        isNullable: false,
        default: false,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn(
      "market_order_chains",
      "is_max_pnl_start_reached"
    );
  }
}
