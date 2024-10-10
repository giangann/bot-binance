import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class UpdateMarketOrderChainsTableAddColsSymbolMaxPnlStartSymbolMaxPnlThreshold1725155595194 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns("market_order_chains", [
      new TableColumn({
        name: "symbol_max_pnl_start",
        type: "varchar",
        isNullable: false,
      }),
      new TableColumn({
        name: "symbol_max_pnl_threshold",
        type: "varchar",
        isNullable: false,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns("market_order_chains", ["symbol_max_pnl_start", "symbol_max_pnl_threshold"]);
  }
}
