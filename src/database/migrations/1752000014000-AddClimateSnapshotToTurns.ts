import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

/**
 * Adds the band-"climate" snapshots to `turns`: the average member happiness and
 * the average relationship level captured each turn, so both can be charted over
 * time. Nullable — turns recorded before this migration have no captured values.
 */
export class AddClimateSnapshotToTurns1752000014000 implements MigrationInterface {
  /**
   * Adds the nullable `happiness_avg_snapshot` and `relationship_avg_snapshot`
   * columns.
   *
   * @param queryRunner - Active TypeORM query runner bound to the transaction.
   * @returns A promise that resolves once applied.
   */
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "turns",
      new TableColumn({
        name: "happiness_avg_snapshot",
        type: "numeric",
        precision: 4,
        scale: 2,
        isNullable: true,
      }),
    );
    await queryRunner.addColumn(
      "turns",
      new TableColumn({
        name: "relationship_avg_snapshot",
        type: "numeric",
        precision: 4,
        scale: 2,
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
    await queryRunner.dropColumn("turns", "relationship_avg_snapshot");
    await queryRunner.dropColumn("turns", "happiness_avg_snapshot");
  }
}
