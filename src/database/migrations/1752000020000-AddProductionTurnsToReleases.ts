import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

/**
 * Adds the remaining production time to `releases` (ADR-0015 §1). Defaults to
 * `0`: drafts created before this feature had no production to run, so they stay
 * launchable right away.
 */
export class AddProductionTurnsToReleases1752000020000 implements MigrationInterface {
  /**
   * Applies the migration: adds `production_turns_left`.
   *
   * @param queryRunner - Active TypeORM query runner bound to the transaction.
   * @returns A promise that resolves once applied.
   */
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "releases",
      new TableColumn({
        name: "production_turns_left",
        type: "smallint",
        isNullable: false,
        default: 0,
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
    await queryRunner.dropColumn("releases", "production_turns_left");
  }
}
