import { query } from "express";
import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateCoinPrice1AMFutureTable1714582475104
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "coin_price_1am_future",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "symbol",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "price",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "mark_price",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "createdAt",
            type: "datetime",
            default: "CURRENT_TIMESTAMP",
          },
          {
            name: "updatedAt",
            type: "datetime",
            default: "CURRENT_TIMESTAMP",
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("coin_price_1am_future");
  }
}
