import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

/**
 * Adds the persistent `avatar` (person emoji) to `band_members`. Existing rows
 * are backfilled with a gender-based default.
 */
export class AddAvatarToBandMembers1752000008000 implements MigrationInterface {
  /**
   * Applies the migration: adds `avatar`, backfills it and makes it NOT NULL.
   *
   * @param queryRunner - Active TypeORM query runner bound to the transaction.
   * @returns A promise that resolves once applied.
   */
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "band_members",
      new TableColumn({
        name: "avatar",
        type: "varchar",
        length: "32",
        isNullable: true,
      }),
    );

    await queryRunner.query(
      `UPDATE "band_members" SET "avatar" = CASE "gender" WHEN 'male' THEN '👨' ELSE '👩' END WHERE "avatar" IS NULL`,
    );

    await queryRunner.changeColumn(
      "band_members",
      "avatar",
      new TableColumn({
        name: "avatar",
        type: "varchar",
        length: "32",
        isNullable: false,
      }),
    );
  }

  /**
   * Reverts the migration by dropping `avatar`.
   *
   * @param queryRunner - Active TypeORM query runner bound to the transaction.
   * @returns A promise that resolves once dropped.
   */
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("band_members", "avatar");
  }
}
