import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

/**
 * Adds the band's cash balance (`balance`) to `bands`. Existing rows are
 * backfilled to the starting capital. The literal `5000` mirrors
 * `STARTING_CAPITAL` at the time this migration was authored (migrations are
 * immutable history, so the value is inlined rather than imported).
 */
export class AddBalanceToBands1752000010000 implements MigrationInterface {
  /**
   * Applies the migration: adds `balance`, backfills it and makes it NOT NULL
   * with a default.
   *
   * @param queryRunner - Active TypeORM query runner bound to the transaction.
   * @returns A promise that resolves once applied.
   */
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "bands",
      new TableColumn({
        name: "balance",
        type: "numeric",
        precision: 12,
        scale: 2,
        isNullable: true,
      }),
    );

    await queryRunner.query(
      `UPDATE "bands" SET "balance" = 5000 WHERE "balance" IS NULL`,
    );

    await queryRunner.changeColumn(
      "bands",
      "balance",
      new TableColumn({
        name: "balance",
        type: "numeric",
        precision: 12,
        scale: 2,
        default: 5000,
        isNullable: false,
      }),
    );
  }

  /**
   * Reverts the migration by dropping `balance`.
   *
   * @param queryRunner - Active TypeORM query runner bound to the transaction.
   * @returns A promise that resolves once dropped.
   */
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("bands", "balance");
  }
}
