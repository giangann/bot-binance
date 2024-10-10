import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class UpdateAutoActiveConfigTableAddColsSymbolMaxPnlStartSymbolMaxPnlThreshold1725156134523 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns("auto_active_config", [
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
    await queryRunner.dropColumns("auto_active_config", ["symbol_max_pnl_start", "symbol_max_pnl_threshold"]);
  }
}
