import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

/**
 * Adds the per-member salary (`salary`) and the arrears counter
 * (`salary_unpaid_turns`) to `band_members` (ADR-0010). Existing rows are
 * backfilled with `SALARY_BASE`; the literal `250` mirrors `SALARY_BASE` at the
 * time this migration was authored (migrations are immutable history, so the
 * value is inlined rather than imported). The per-member target is only computed
 * in application code, so legacy rows get a reasonable flat default.
 */
export class AddSalaryToBandMembers1752000015000 implements MigrationInterface {
  /**
   * Applies the migration: adds `salary` (backfilled, NOT NULL) and
   * `salary_unpaid_turns` (NOT NULL default 0).
   *
   * @param queryRunner - Active TypeORM query runner bound to the transaction.
   * @returns A promise that resolves once applied.
   */
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "band_members",
      new TableColumn({
        name: "salary",
        type: "numeric",
        precision: 12,
        scale: 2,
        isNullable: true,
      }),
    );

    await queryRunner.query(
      `UPDATE "band_members" SET "salary" = 250 WHERE "salary" IS NULL`,
    );

    await queryRunner.changeColumn(
      "band_members",
      "salary",
      new TableColumn({
        name: "salary",
        type: "numeric",
        precision: 12,
        scale: 2,
        default: 0,
        isNullable: false,
      }),
    );

    await queryRunner.addColumn(
      "band_members",
      new TableColumn({
        name: "salary_unpaid_turns",
        type: "smallint",
        default: 0,
        isNullable: false,
      }),
    );
  }

  /**
   * Reverts the migration by dropping both columns.
   *
   * @param queryRunner - Active TypeORM query runner bound to the transaction.
   * @returns A promise that resolves once dropped.
   */
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("band_members", "salary_unpaid_turns");
    await queryRunner.dropColumn("band_members", "salary");
  }
}
