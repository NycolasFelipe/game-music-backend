import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from "typeorm";

/**
 * Creates the `band_gigs` table — the append-only history of live seasons
 * (ADR-0016 §6). Rows cascade-delete with their band. The per-turn limit is read
 * from this history (`played_at_year`), so no column is added to `bands`.
 */
export class CreateBandGigsTable1752000021000 implements MigrationInterface {
  /**
   * Creates the table, its band index and cascading foreign key.
   *
   * @param queryRunner - Active TypeORM query runner bound to the transaction.
   * @returns A promise that resolves once applied.
   */
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "band_gigs",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            default: "uuid_generate_v4()",
          },
          { name: "band_id", type: "uuid" },
          { name: "gig_type_id", type: "varchar", length: "32" },
          {
            name: "played_at_year",
            type: "numeric",
            precision: 6,
            scale: 1,
          },
          { name: "fee", type: "numeric", precision: 12, scale: 2 },
          { name: "cost", type: "numeric", precision: 12, scale: 2 },
          { name: "fans_gained", type: "integer", default: 0 },
          { name: "performance", type: "numeric", precision: 4, scale: 2 },
          {
            name: "happiness_delta",
            type: "numeric",
            precision: 4,
            scale: 2,
          },
          {
            name: "created_at",
            type: "timestamptz",
            default: "now()",
          },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      "band_gigs",
      new TableIndex({
        name: "IDX_band_gigs_band_id",
        columnNames: ["band_id"],
      }),
    );

    await queryRunner.createForeignKey(
      "band_gigs",
      new TableForeignKey({
        name: "FK_band_gigs_band",
        columnNames: ["band_id"],
        referencedTableName: "bands",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
      }),
    );
  }

  /**
   * Drops the table (its index and foreign key go with it).
   *
   * @param queryRunner - Active TypeORM query runner bound to the transaction.
   * @returns A promise that resolves once dropped.
   */
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("band_gigs", true);
  }
}
