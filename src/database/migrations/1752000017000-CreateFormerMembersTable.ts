import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from "typeorm";

/**
 * Creates the `former_members` table — a snapshot of members who left the band
 * (ADR-0010). Departures archive the member's data (skills, traits, mood, last
 * salary, turns unpaid, and a snapshot of their relationships) before the live
 * `band_members` row is deleted, so ex-members remain viewable. Rows cascade
 * with their band.
 */
export class CreateFormerMembersTable1752000017000 implements MigrationInterface {
  /**
   * Creates the table, its band index and cascading foreign key.
   *
   * @param queryRunner - Active TypeORM query runner bound to the transaction.
   * @returns A promise that resolves once created.
   */
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "former_members",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            default: "uuid_generate_v4()",
          },
          { name: "band_id", type: "uuid" },
          { name: "original_member_id", type: "uuid" },
          { name: "name", type: "varchar", length: "255" },
          { name: "age", type: "smallint" },
          { name: "gender", type: "varchar", length: "16" },
          { name: "avatar", type: "varchar", length: "32" },
          { name: "happiness", type: "numeric", precision: 4, scale: 2 },
          { name: "characteristics", type: "text", isArray: true },
          { name: "skills", type: "jsonb" },
          { name: "biography", type: "text" },
          { name: "primary_skill", type: "varchar", length: "16" },
          { name: "join_year", type: "smallint", isNullable: true },
          { name: "salary", type: "numeric", precision: 12, scale: 2 },
          { name: "unpaid_turns", type: "smallint" },
          { name: "reason", type: "varchar", length: "32" },
          { name: "left_at_year", type: "numeric", precision: 6, scale: 1 },
          { name: "relationships", type: "jsonb", default: "'[]'" },
          { name: "created_at", type: "timestamptz", default: "now()" },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      "former_members",
      new TableIndex({
        name: "IDX_former_members_band_id",
        columnNames: ["band_id"],
      }),
    );

    await queryRunner.createForeignKey(
      "former_members",
      new TableForeignKey({
        columnNames: ["band_id"],
        referencedTableName: "bands",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
      }),
    );
  }

  /**
   * Drops the `former_members` table.
   *
   * @param queryRunner - Active TypeORM query runner bound to the transaction.
   * @returns A promise that resolves once dropped.
   */
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("former_members");
  }
}
