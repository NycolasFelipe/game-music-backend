import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from "typeorm";

/**
 * Creates the `band_members` table, each row belonging to a band
 * (`band_id` → `bands`, cascading on delete).
 */
export class CreateBandMembersTable1752000002000 implements MigrationInterface {
  /**
   * Applies the migration: creates `band_members` with an FK/index on
   * `band_id`.
   *
   * @param queryRunner - Active TypeORM query runner bound to the transaction.
   * @returns A promise that resolves once the schema changes are applied.
   */
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "band_members",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            default: "uuid_generate_v4()",
          },
          { name: "band_id", type: "uuid" },
          { name: "name", type: "varchar", length: "255" },
          { name: "age", type: "smallint" },
          { name: "gender", type: "varchar", length: "16" },
          {
            name: "happiness",
            type: "numeric",
            precision: 4,
            scale: 2,
            default: 0,
          },
          {
            name: "characteristics",
            type: "text",
            isArray: true,
            default: "'{}'",
          },
          { name: "skills", type: "jsonb" },
          { name: "biography", type: "text" },
          { name: "primary_skill", type: "varchar", length: "16" },
          { name: "join_year", type: "smallint", isNullable: true },
          { name: "created_at", type: "timestamptz", default: "now()" },
          { name: "updated_at", type: "timestamptz", default: "now()" },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      "band_members",
      new TableIndex({
        name: "IDX_band_members_band_id",
        columnNames: ["band_id"],
      }),
    );

    await queryRunner.createForeignKey(
      "band_members",
      new TableForeignKey({
        columnNames: ["band_id"],
        referencedTableName: "bands",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
      }),
    );
  }

  /**
   * Reverts the migration by dropping the `band_members` table.
   *
   * @param queryRunner - Active TypeORM query runner bound to the transaction.
   * @returns A promise that resolves once the table is dropped.
   */
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("band_members");
  }
}
