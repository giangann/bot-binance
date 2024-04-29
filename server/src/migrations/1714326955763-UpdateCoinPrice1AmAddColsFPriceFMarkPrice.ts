import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class UpdateCoinPrice1AmAddColsFPriceFMarkPrice1714326955763
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns("coin_price_1am", [
      new TableColumn({
        name: "f_price",
        type: "varchar",
        isNullable: true,
      }),
      new TableColumn({
        name: "f_mark_price",
        type: "varchar",
        isNullable: true,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns("coin_price_1am", [
      "f_price",
      "f_mark_price",
    ]);
  }
}
