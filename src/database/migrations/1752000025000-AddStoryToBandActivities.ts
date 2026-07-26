import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

/**
 * Adds the night's story to `band_activities` (ADR-0017 §6). Kept on the row so
 * the player can re-read what happened later — the narrative is generated once,
 * at the moment it happens, and re-rolling it afterwards would rewrite history.
 */
export class AddStoryToBandActivities1752000025000 implements MigrationInterface {
  /**
   * Applies the migration: adds `story`, defaulting to an empty array.
   *
   * @param queryRunner - Active TypeORM query runner bound to the transaction.
   * @returns A promise that resolves once applied.
   */
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "band_activities",
      new TableColumn({
        name: "story",
        type: "jsonb",
        isNullable: false,
        default: "'[]'",
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
    await queryRunner.dropColumn("band_activities", "story");
  }
}
