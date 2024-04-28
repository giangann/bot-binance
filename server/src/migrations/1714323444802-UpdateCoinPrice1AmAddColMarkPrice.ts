import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class UpdateCoinPrice1AmAddColMarkPrice1714323444802 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumns("coin_price_1am", [
            new TableColumn({
              name: "mark_price",
              type: "varchar",
              isNullable: true,
            }),
          ]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('coin_price_1am','mark_price')
    }

}
