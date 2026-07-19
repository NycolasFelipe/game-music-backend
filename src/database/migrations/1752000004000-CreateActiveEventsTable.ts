import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from "typeorm";

/**
 * Creates the `active_events` table: events instantiated for a band that the
 * player resolves by choosing an option.
 */
export class CreateActiveEventsTable1752000004000 implements MigrationInterface {
  /**
   * Applies the migration: creates `active_events` with an FK/index on
   * `band_id` (cascading).
   *
   * @param queryRunner - Active TypeORM query runner.
   * @returns A promise that resolves once applied.
   */
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "active_events",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            default: "uuid_generate_v4()",
          },
          { name: "band_id", type: "uuid" },
          { name: "template_id", type: "varchar", length: "128" },
          { name: "year", type: "numeric", precision: 6, scale: 1 },
          { name: "type", type: "varchar", length: "64", default: "''" },
          { name: "title", type: "text" },
          { name: "description", type: "text" },
          {
            name: "involved_character_ids",
            type: "text",
            isArray: true,
            default: "'{}'",
          },
          { name: "options", type: "jsonb" },
          { name: "resolved", type: "boolean", default: false },
          {
            name: "chosen_option_id",
            type: "varchar",
            length: "64",
            isNullable: true,
          },
          { name: "outcome", type: "jsonb", isNullable: true },
          { name: "created_at", type: "timestamptz", default: "now()" },
          { name: "resolved_at", type: "timestamptz", isNullable: true },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      "active_events",
      new TableIndex({
        name: "IDX_active_events_band_id",
        columnNames: ["band_id"],
      }),
    );

    await queryRunner.createForeignKey(
      "active_events",
      new TableForeignKey({
        columnNames: ["band_id"],
        referencedTableName: "bands",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
      }),
    );
  }

  /**
   * Reverts the migration by dropping the table.
   *
   * @param queryRunner - Active TypeORM query runner.
   * @returns A promise that resolves once dropped.
   */
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("active_events");
  }
}
