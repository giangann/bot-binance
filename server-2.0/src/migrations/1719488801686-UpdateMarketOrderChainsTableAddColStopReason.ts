import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class UpdateMarketOrderChainsTableAddColStopReason1719488801686
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "market_order_chains",
      new TableColumn({
        name: "stop_reason",
        type: "varchar",
        isNullable: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("market_order_chains", "stop_reason");
  }
}
