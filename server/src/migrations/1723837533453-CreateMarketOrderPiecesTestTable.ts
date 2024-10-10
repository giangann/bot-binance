import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateMarketOrderPiecesTestTable1723837533453 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "market_order_pieces_test",
        columns: [
          {
            name: "id",
            type: "varchar",
            length: "255",
            isPrimary: true,
            isNullable: false,
          },
          {
            name: "timestamp",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
            isNullable: false,
          },
          {
            name: "market_order_chains_test_id",
            type: "int",
            isNullable: false,
          },
          {
            name: "total_balance",
            type: "varchar",
            length: "255",
            isNullable: false,
          },
          {
            name: "createdAt",
            type: "datetime",
            default: "CURRENT_TIMESTAMP",
            isNullable: true,
          },
          {
            name: "updatedAt",
            type: "datetime",
            default: "CURRENT_TIMESTAMP",
            onUpdate: "CURRENT_TIMESTAMP",
            isNullable: false,
          },
          {
            name: "percent_change",
            type: "varchar",
            length: "255",
            isNullable: false,
          },
          {
            name: "price",
            type: "varchar",
            length: "255",
            isNullable: false,
          },
          {
            name: "symbol",
            type: "varchar",
            length: "255",
            isNullable: false,
          },
          {
            name: "direction",
            type: "varchar",
            length: "255",
            isNullable: false,
          },
          {
            name: "quantity",
            type: "varchar",
            length: "255",
            isNullable: false,
          },
          {
            name: "transaction_size",
            type: "varchar",
            length: "255",
            isNullable: false,
          },
        ],
      })
    );

    await queryRunner.createForeignKey(
      "market_order_pieces_test",
      new TableForeignKey({
        columnNames: ["market_order_chains_test_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "market_order_chains_test",
        onDelete: "CASCADE",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("market_order_pieces_test");
  }
}
