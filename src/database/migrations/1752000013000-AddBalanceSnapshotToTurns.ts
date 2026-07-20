import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

/**
 * Adds `balance_snapshot` to `turns` so the money timeline can be charted. It is
 * nullable: turns recorded before this migration have no captured balance.
 */
export class AddBalanceSnapshotToTurns1752000013000 implements MigrationInterface {
  /**
   * Adds the nullable `balance_snapshot` column.
   *
   * @param queryRunner - Active TypeORM query runner bound to the transaction.
   * @returns A promise that resolves once applied.
   */
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "turns",
      new TableColumn({
        name: "balance_snapshot",
        type: "numeric",
        precision: 12,
        scale: 2,
        isNullable: true,
      }),
    );
  }

  /**
   * Reverts the migration by dropping `balance_snapshot`.
   *
   * @param queryRunner - Active TypeORM query runner bound to the transaction.
   * @returns A promise that resolves once dropped.
   */
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("turns", "balance_snapshot");
  }
}
