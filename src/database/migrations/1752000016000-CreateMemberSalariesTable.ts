import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from "typeorm";

/**
 * Creates the `member_salaries` table — the append-only salary history /
 * renegotiation log (ADR-0010 §1). Rows cascade-delete with their member (and,
 * transitively, their band). Existing members are seeded with an `inicial`
 * agreement equal to their current `band_members.salary`, effective in their
 * band's current year.
 */
export class CreateMemberSalariesTable1752000016000 implements MigrationInterface {
  /**
   * Creates the table, its member index and cascading foreign keys, then seeds
   * the initial agreements for existing members.
   *
   * @param queryRunner - Active TypeORM query runner bound to the transaction.
   * @returns A promise that resolves once applied.
   */
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "member_salaries",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            default: "uuid_generate_v4()",
          },
          { name: "member_id", type: "uuid" },
          { name: "band_id", type: "uuid" },
          { name: "amount", type: "numeric", precision: 12, scale: 2 },
          {
            name: "effective_year",
            type: "numeric",
            precision: 6,
            scale: 1,
          },
          { name: "reason", type: "varchar", length: "32" },
          { name: "created_at", type: "timestamptz", default: "now()" },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      "member_salaries",
      new TableIndex({
        name: "IDX_member_salaries_member_id",
        columnNames: ["member_id"],
      }),
    );

    await queryRunner.createForeignKey(
      "member_salaries",
      new TableForeignKey({
        columnNames: ["member_id"],
        referencedTableName: "band_members",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
      }),
    );

    await queryRunner.createForeignKey(
      "member_salaries",
      new TableForeignKey({
        columnNames: ["band_id"],
        referencedTableName: "bands",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
      }),
    );

    // Seed one initial agreement per existing member from their current salary.
    await queryRunner.query(
      `INSERT INTO "member_salaries" ("member_id", "band_id", "amount", "effective_year", "reason")
       SELECT bm."id", bm."band_id", bm."salary", b."current_year", 'inicial'
       FROM "band_members" bm
       JOIN "bands" b ON b."id" = bm."band_id"`,
    );
  }

  /**
   * Drops the `member_salaries` table.
   *
   * @param queryRunner - Active TypeORM query runner bound to the transaction.
   * @returns A promise that resolves once dropped.
   */
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("member_salaries");
  }
}
