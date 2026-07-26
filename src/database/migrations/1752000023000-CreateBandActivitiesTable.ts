import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from "typeorm";

/**
 * Creates the `band_activities` table — the append-only history of
 * confraternizações (ADR-0017 §5). Rows cascade-delete with their band. The
 * diminishing returns of §2 are read from this history (`held_at_year`), so no
 * column is added to `bands`.
 */
export class CreateBandActivitiesTable1752000023000 implements MigrationInterface {
  /**
   * Creates the table, its band index and cascading foreign key.
   *
   * @param queryRunner - Active TypeORM query runner bound to the transaction.
   * @returns A promise that resolves once applied.
   */
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "band_activities",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            default: "uuid_generate_v4()",
          },
          { name: "band_id", type: "uuid" },
          { name: "activity_id", type: "varchar", length: "32" },
          {
            name: "held_at_year",
            type: "numeric",
            precision: 6,
            scale: 1,
          },
          { name: "cost", type: "numeric", precision: 12, scale: 2 },
          { name: "participant_ids", type: "jsonb", default: "'[]'" },
          {
            name: "happiness_delta",
            type: "numeric",
            precision: 4,
            scale: 2,
          },
          { name: "relationship_delta", type: "smallint", default: 0 },
          { name: "trouble", type: "boolean", default: false },
          { name: "trouble_event_id", type: "uuid", isNullable: true },
          { name: "created_at", type: "timestamptz", default: "now()" },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      "band_activities",
      new TableIndex({
        name: "IDX_band_activities_band_id",
        columnNames: ["band_id"],
      }),
    );

    await queryRunner.createForeignKey(
      "band_activities",
      new TableForeignKey({
        name: "FK_band_activities_band",
        columnNames: ["band_id"],
        referencedTableName: "bands",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
      }),
    );
  }

  /**
   * Drops the table (index and foreign key go with it).
   *
   * @param queryRunner - Active TypeORM query runner bound to the transaction.
   * @returns A promise that resolves once dropped.
   */
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("band_activities", true);
  }
}
