import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from "typeorm";

/**
 * Creates the `releases` table (musical works). Outcome columns are nullable
 * while a row is a draft (`em_criacao`); they are filled on finalization
 * (ADR-0008). Rows cascade-delete with their band.
 */
export class CreateReleasesTable1752000011000 implements MigrationInterface {
  /**
   * Creates the table, its band index and its cascading foreign key.
   *
   * @param queryRunner - Active TypeORM query runner bound to the transaction.
   * @returns A promise that resolves once created.
   */
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "releases",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            default: "uuid_generate_v4()",
          },
          { name: "band_id", type: "uuid" },
          { name: "title", type: "varchar", length: "255" },
          { name: "concept", type: "text", default: "''" },
          { name: "format", type: "varchar", length: "32" },
          { name: "style", type: "varchar", length: "64" },
          { name: "budget_tier", type: "varchar", length: "32" },
          {
            name: "status",
            type: "varchar",
            length: "16",
            default: "'em_criacao'",
          },
          { name: "credits", type: "jsonb", default: "'{}'" },
          {
            name: "quality",
            type: "numeric",
            precision: 6,
            scale: 1,
            isNullable: true,
          },
          {
            name: "quality_tier",
            type: "varchar",
            length: "32",
            isNullable: true,
          },
          { name: "fans_gained", type: "integer", isNullable: true },
          {
            name: "cost",
            type: "numeric",
            precision: 12,
            scale: 2,
            isNullable: true,
          },
          {
            name: "master_revenue_total",
            type: "numeric",
            precision: 12,
            scale: 2,
            isNullable: true,
          },
          {
            name: "publishing_revenue_total",
            type: "numeric",
            precision: 12,
            scale: 2,
            isNullable: true,
          },
          {
            name: "royalty_remaining",
            type: "numeric",
            precision: 12,
            scale: 2,
            default: 0,
          },
          { name: "royalty_turns_left", type: "integer", default: 0 },
          {
            name: "released_at_year",
            type: "numeric",
            precision: 6,
            scale: 1,
            isNullable: true,
          },
          { name: "creation_log", type: "jsonb", default: "'[]'" },
          { name: "details", type: "jsonb", isNullable: true },
          { name: "created_at", type: "timestamptz", default: "now()" },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      "releases",
      new TableIndex({
        name: "IDX_releases_band_id",
        columnNames: ["band_id"],
      }),
    );

    await queryRunner.createForeignKey(
      "releases",
      new TableForeignKey({
        columnNames: ["band_id"],
        referencedTableName: "bands",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
      }),
    );
  }

  /**
   * Drops the `releases` table.
   *
   * @param queryRunner - Active TypeORM query runner bound to the transaction.
   * @returns A promise that resolves once dropped.
   */
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("releases");
  }
}
