import { MigrationInterface, QueryRunner } from "typeorm";

/**
 * Fixes members whose `avatar` was backfilled as a plain (yellow) person emoji
 * by the previous migration: gives each a natural, random skin tone. Newly
 * generated members already include a skin tone, so they are unaffected.
 */
export class ReskinDefaultAvatars1752000009000 implements MigrationInterface {
  /**
   * Replaces plain `👨`/`👩` avatars with a random skin-toned variant.
   *
   * @param queryRunner - Active TypeORM query runner bound to the transaction.
   * @returns A promise that resolves once applied.
   */
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `UPDATE "band_members"
       SET "avatar" = (CASE "gender" WHEN 'male' THEN '👨' ELSE '👩' END)
         || (ARRAY['🏻','🏼','🏽','🏾','🏿'])[floor(random() * 5) + 1]
       WHERE "avatar" IN ('👨', '👩')`,
    );
  }

  /**
   * Irreversible data fix — no-op on revert.
   *
   * @returns A resolved promise.
   */
  public async down(): Promise<void> {
    // The original (yellow) avatars are not recoverable; nothing to undo.
  }
}
