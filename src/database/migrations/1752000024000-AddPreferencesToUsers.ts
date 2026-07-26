import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

/**
 * Adds account-level preferences to `users` (ADR-0018). A `jsonb` blob rather
 * than a column per setting: these are UI tastes with no queries or constraints
 * on them, and each new one would otherwise cost a migration.
 */
export class AddPreferencesToUsers1752000024000 implements MigrationInterface {
  /**
   * Applies the migration: adds `preferences`, defaulting to an empty object.
   *
   * @param queryRunner - Active TypeORM query runner bound to the transaction.
   * @returns A promise that resolves once applied.
   */
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "users",
      new TableColumn({
        name: "preferences",
        type: "jsonb",
        isNullable: false,
        default: "'{}'",
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
    await queryRunner.dropColumn("users", "preferences");
  }
}
