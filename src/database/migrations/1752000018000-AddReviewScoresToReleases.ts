import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

/**
 * Adds the critic and public reception scores to `releases` (ADR-0011). Both are
 * nullable: they are computed only at finalization going forward, so works
 * launched before this feature stay `null` (no backfill). The tiers are derived
 * from the scores on read, so no tier columns are added.
 */
export class AddReviewScoresToReleases1752000018000 implements MigrationInterface {
  /**
   * Applies the migration: adds `critic_score` and `public_score`.
   *
   * @param queryRunner - Active TypeORM query runner bound to the transaction.
   * @returns A promise that resolves once applied.
   */
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "releases",
      new TableColumn({
        name: "critic_score",
        type: "numeric",
        precision: 6,
        scale: 1,
        isNullable: true,
      }),
    );

    await queryRunner.addColumn(
      "releases",
      new TableColumn({
        name: "public_score",
        type: "numeric",
        precision: 6,
        scale: 1,
        isNullable: true,
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
    await queryRunner.dropColumn("releases", "public_score");
    await queryRunner.dropColumn("releases", "critic_score");
  }
}
