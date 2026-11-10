import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

/**
 * Adds `low_mood_turns` to `band_members` (ADR-0032 §5): how many consecutive
 * turn advances a member ended in a bad mood. A member who reaches the limit
 * leaves the band. Existing members start at 0.
 */
export class AddLowMoodTurnsToBandMembers1752000027000 implements MigrationInterface {
  /**
   * Applies the migration: adds the counter, defaulting to 0.
   *
   * @param queryRunner - Active TypeORM query runner bound to the transaction.
   * @returns A promise that resolves once applied.
   */
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "band_members",
      new TableColumn({
        name: "low_mood_turns",
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
    await queryRunner.dropColumn("band_members", "low_mood_turns");
  }
}
