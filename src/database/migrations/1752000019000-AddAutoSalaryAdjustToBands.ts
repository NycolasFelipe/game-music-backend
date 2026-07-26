import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

/**
 * Adds the automatic salary adjustment option to `bands` (ADR-0013). Defaults to
 * `false` so existing saves keep the current behaviour (manual salaries only).
 */
export class AddAutoSalaryAdjustToBands1752000019000 implements MigrationInterface {
  /**
   * Applies the migration: adds `auto_salary_adjust`.
   *
   * @param queryRunner - Active TypeORM query runner bound to the transaction.
   * @returns A promise that resolves once applied.
   */
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "bands",
      new TableColumn({
        name: "auto_salary_adjust",
        type: "boolean",
        isNullable: false,
        default: false,
      }),
    );
  }

  /**
   * Reverts the migration by dropping the column.
   *
   * @param queryRunner - Active TypeORM query runner bound to the transaction.
   * @returns A promise that resolves once dropped.
   */
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("bands", "auto_salary_adjust");
  }
}
