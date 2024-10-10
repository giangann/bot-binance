import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class UpdateAutoActiveConfigTableAddColSymbolPnlToCutloss1725159112099 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "auto_active_config",
      new TableColumn({
        name: "symbol_pnl_to_cutloss",
        type: "varchar",
        isNullable: false,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("auto_active_config", "symbol_pnl_to_cutloss");
  }
}
