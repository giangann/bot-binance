import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from "typeorm";

export class CreateMarketOrderPiecesTable1713015709928
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "market_order_pieces",
        columns: [
          {
            name: "id",
            type: "varchar",
            isGenerated: false,
            isPrimary: true,
          },
          {
            name: "timestamp",
            type: "varchar",
            default: `${Date.now()}`,
            isNullable: true,
          },
          {
            name: "market_order_chains_id",
            type: "int",
            isNullable: false,
          },
          {
            name: "total_balance",
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

    await queryRunner.createForeignKey(
      "market_order_pieces",
      new TableForeignKey({
        columnNames: ["market_order_chains_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "market_order_chains",
        onDelete: "CASCADE",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("market_order_pieces");
  }
}
