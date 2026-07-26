import { MigrationInterface, QueryRunner } from "typeorm";

/**
 * Turns the automatic salary adjustment on by default (ADR-0013). Negotiating
 * every raise by hand turned out to be busywork rather than a decision, so the
 * comfortable behaviour becomes the starting one — the player still turns it off
 * in the game options. Existing saves are migrated along with the default: the
 * option is new enough that no save meaningfully chose to keep it off.
 */
export class EnableAutoSalaryAdjustByDefault1752000022000 implements MigrationInterface {
  /**
   * Applies the migration: flips the column default and the existing rows.
   *
   * @param queryRunner - Active TypeORM query runner bound to the transaction.
   * @returns A promise that resolves once applied.
   */
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bands" ALTER COLUMN "auto_salary_adjust" SET DEFAULT true`,
    );
    await queryRunner.query(
      `UPDATE "bands" SET "auto_salary_adjust" = true WHERE "auto_salary_adjust" = false`,
    );
  }

  /**
   * Reverts the default to `false`. The rows are left as they are: the player's
   * current choice is not a schema detail to be rolled back.
   *
   * @param queryRunner - Active TypeORM query runner bound to the transaction.
   * @returns A promise that resolves once reverted.
   */
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bands" ALTER COLUMN "auto_salary_adjust" SET DEFAULT false`,
    );
  }
}
