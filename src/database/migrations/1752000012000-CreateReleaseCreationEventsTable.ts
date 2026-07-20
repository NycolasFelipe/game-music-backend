import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from "typeorm";

/**
 * Creates the `release_creation_events` table (mirrors `active_events`). Each
 * row is one interactive decision shaping a release draft; it cascade-deletes
 * with its release (ADR-0008 §6).
 */
export class CreateReleaseCreationEventsTable1752000012000 implements MigrationInterface {
  /**
   * Creates the table, its release index and its cascading foreign key.
   *
   * @param queryRunner - Active TypeORM query runner bound to the transaction.
   * @returns A promise that resolves once created.
   */
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "release_creation_events",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            default: "uuid_generate_v4()",
          },
          { name: "release_id", type: "uuid" },
          { name: "sequence", type: "integer" },
          { name: "kind", type: "varchar", length: "32" },
          { name: "prompt", type: "text" },
          { name: "options", type: "jsonb" },
          { name: "resolved", type: "boolean", default: false },
          {
            name: "chosen_option_id",
            type: "varchar",
            length: "64",
            isNullable: true,
          },
          {
            name: "quality_modifier",
            type: "numeric",
            precision: 5,
            scale: 3,
            isNullable: true,
          },
          { name: "created_at", type: "timestamptz", default: "now()" },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      "release_creation_events",
      new TableIndex({
        name: "IDX_release_creation_events_release_id",
        columnNames: ["release_id"],
      }),
    );

    await queryRunner.createForeignKey(
      "release_creation_events",
      new TableForeignKey({
        columnNames: ["release_id"],
        referencedTableName: "releases",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
      }),
    );
  }

  /**
   * Drops the `release_creation_events` table.
   *
   * @param queryRunner - Active TypeORM query runner bound to the transaction.
   * @returns A promise that resolves once dropped.
   */
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("release_creation_events");
  }
}
