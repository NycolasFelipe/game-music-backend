import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from "typeorm";

/**
 * Creates the `bands` table, owned by a user (`owner_id` → `users`).
 */
export class CreateBandsTable1752000001000 implements MigrationInterface {
  /**
   * Applies the migration: creates `bands` with an FK/index on `owner_id`.
   *
   * @param queryRunner - Active TypeORM query runner bound to the transaction.
   * @returns A promise that resolves once the schema changes are applied.
   */
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    await queryRunner.createTable(
      new Table({
        name: "bands",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            default: "uuid_generate_v4()",
          },
          { name: "owner_id", type: "uuid" },
          { name: "name", type: "varchar", length: "255" },
          { name: "theme", type: "varchar", length: "64" },
          { name: "origin", type: "varchar", length: "64" },
          { name: "foundation_year", type: "smallint" },
          { name: "fan_count", type: "integer", default: 0 },
          { name: "created_at", type: "timestamptz", default: "now()" },
          { name: "updated_at", type: "timestamptz", default: "now()" },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      "bands",
      new TableIndex({ name: "IDX_bands_owner_id", columnNames: ["owner_id"] }),
    );

    await queryRunner.createForeignKey(
      "bands",
      new TableForeignKey({
        columnNames: ["owner_id"],
        referencedTableName: "users",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
      }),
    );
  }

  /**
   * Reverts the migration by dropping the `bands` table (FKs included).
   *
   * @param queryRunner - Active TypeORM query runner bound to the transaction.
   * @returns A promise that resolves once the table is dropped.
   */
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("bands");
  }
}
