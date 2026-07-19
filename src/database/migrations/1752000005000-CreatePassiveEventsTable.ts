import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from "typeorm";

/**
 * Creates the `passive_events` table: narrative timeline events (world artists)
 * belonging to a band's history.
 */
export class CreatePassiveEventsTable1752000005000 implements MigrationInterface {
  /**
   * Applies the migration: creates `passive_events` with an FK/index on
   * `band_id` (cascading).
   *
   * @param queryRunner - Active TypeORM query runner.
   * @returns A promise that resolves once applied.
   */
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "passive_events",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            default: "uuid_generate_v4()",
          },
          { name: "band_id", type: "uuid" },
          { name: "template_id", type: "varchar", length: "64" },
          { name: "year", type: "numeric", precision: 6, scale: 1 },
          { name: "type", type: "varchar", length: "64" },
          { name: "description", type: "text" },
          { name: "artists", type: "text", isArray: true, default: "'{}'" },
          { name: "created_at", type: "timestamptz", default: "now()" },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      "passive_events",
      new TableIndex({
        name: "IDX_passive_events_band_id",
        columnNames: ["band_id"],
      }),
    );

    await queryRunner.createForeignKey(
      "passive_events",
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
    await queryRunner.dropTable("passive_events");
  }
}
