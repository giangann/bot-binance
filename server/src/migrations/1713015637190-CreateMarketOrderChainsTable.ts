import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateMarketOrderChainsTable1713015637190
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "market_order_chains",
        columns: [
          {
            name: "id",
            type: "int",
            isGenerated: true,
            generationStrategy: "increment",
            isPrimary: true,
          },
          {
            name: "status",
            type: "varchar",
            isNullable: false,
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
    await queryRunner.dropTable("market_order_chains");
  }
}
