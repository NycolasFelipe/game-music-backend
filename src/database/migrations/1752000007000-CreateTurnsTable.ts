import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from "typeorm";

/**
 * Creates the `turns` table: the per-band turn history (an append-only snapshot
 * of the clock each time a turn is taken, with references to events produced).
 */
export class CreateTurnsTable1752000007000 implements MigrationInterface {
  /**
   * Applies the migration: creates `turns` with an FK/index on `band_id`
   * (cascading).
   *
   * @param queryRunner - Active TypeORM query runner bound to the transaction.
   * @returns A promise that resolves once applied.
   */
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "turns",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            default: "uuid_generate_v4()",
          },
          { name: "band_id", type: "uuid" },
          { name: "year", type: "numeric", precision: 6, scale: 1 },
          { name: "fan_count_snapshot", type: "integer" },
          { name: "passive_event_id", type: "uuid", isNullable: true },
          { name: "active_event_id", type: "uuid", isNullable: true },
          { name: "created_at", type: "timestamptz", default: "now()" },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      "turns",
      new TableIndex({
        name: "IDX_turns_band_id",
        columnNames: ["band_id"],
      }),
    );

    await queryRunner.createForeignKey(
      "turns",
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
   * @param queryRunner - Active TypeORM query runner bound to the transaction.
   * @returns A promise that resolves once dropped.
   */
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("turns");
  }
}
