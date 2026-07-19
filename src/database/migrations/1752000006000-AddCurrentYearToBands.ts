import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

/**
 * Adds the live in-game clock (`current_year`) to `bands`. Existing rows are
 * backfilled to their `foundation_year` (the save's starting year).
 */
export class AddCurrentYearToBands1752000006000 implements MigrationInterface {
  /**
   * Applies the migration: adds `current_year`, backfills it and makes it
   * NOT NULL.
   *
   * @param queryRunner - Active TypeORM query runner bound to the transaction.
   * @returns A promise that resolves once applied.
   */
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "bands",
      new TableColumn({
        name: "current_year",
        type: "numeric",
        precision: 6,
        scale: 1,
        isNullable: true,
      }),
    );

    await queryRunner.query(
      `UPDATE "bands" SET "current_year" = "foundation_year" WHERE "current_year" IS NULL`,
    );

    await queryRunner.changeColumn(
      "bands",
      "current_year",
      new TableColumn({
        name: "current_year",
        type: "numeric",
        precision: 6,
        scale: 1,
        isNullable: false,
      }),
    );
  }

  /**
   * Reverts the migration by dropping `current_year`.
   *
   * @param queryRunner - Active TypeORM query runner bound to the transaction.
   * @returns A promise that resolves once dropped.
   */
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("bands", "current_year");
  }
}
