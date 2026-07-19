import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from "typeorm";

/**
 * Creates the `member_relationships` table: non-directional relationships
 * between two members of the same band, stored in canonical order.
 */
export class CreateMemberRelationshipsTable1752000003000 implements MigrationInterface {
  /**
   * Applies the migration: creates `member_relationships` with FKs to `bands`
   * and `band_members` (cascading) plus a unique pair index.
   *
   * @param queryRunner - Active TypeORM query runner.
   * @returns A promise that resolves once applied.
   */
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "member_relationships",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            default: "uuid_generate_v4()",
          },
          { name: "band_id", type: "uuid" },
          { name: "member_a_id", type: "uuid" },
          { name: "member_b_id", type: "uuid" },
          { name: "level", type: "smallint" },
          { name: "created_at", type: "timestamptz", default: "now()" },
          { name: "updated_at", type: "timestamptz", default: "now()" },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      "member_relationships",
      new TableIndex({
        name: "IDX_member_relationships_band_id",
        columnNames: ["band_id"],
      }),
    );

    await queryRunner.createIndex(
      "member_relationships",
      new TableIndex({
        name: "UQ_member_relationships_pair",
        columnNames: ["member_a_id", "member_b_id"],
        isUnique: true,
      }),
    );

    await queryRunner.createForeignKey(
      "member_relationships",
      new TableForeignKey({
        columnNames: ["band_id"],
        referencedTableName: "bands",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
      }),
    );

    for (const column of ["member_a_id", "member_b_id"]) {
      await queryRunner.createForeignKey(
        "member_relationships",
        new TableForeignKey({
          columnNames: [column],
          referencedTableName: "band_members",
          referencedColumnNames: ["id"],
          onDelete: "CASCADE",
        }),
      );
    }
  }

  /**
   * Reverts the migration by dropping the table.
   *
   * @param queryRunner - Active TypeORM query runner.
   * @returns A promise that resolves once dropped.
   */
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("member_relationships");
  }
}
