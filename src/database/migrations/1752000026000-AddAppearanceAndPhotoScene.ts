import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

/**
 * SQL expression drawing a member's look with the distributions of
 * `generateAppearance` (ADR-0023), from the row's `gender`, `age` and `avatar`.
 * Glasses use two independent `random()` calls (≈12% sun, ≈15% round).
 */
const APPEARANCE_SQL = `jsonb_build_object(
  'hairStyle', CASE
    WHEN "avatar" LIKE '%🦲%' THEN 'bald'
    WHEN "gender" = 'female' AND "avatar" LIKE '%🦱%' THEN 'curlylong'
    WHEN "gender" = 'female' THEN (ARRAY['long','long','bob','bun','long'])[floor(random() * 5) + 1]
    WHEN "avatar" LIKE '%🦱%' THEN (ARRAY['curly','afro'])[floor(random() * 2) + 1]
    ELSE (ARRAY['short','quiff','long','buzz','short'])[floor(random() * 5) + 1]
  END,
  'beard', CASE
    WHEN "gender" = 'male' AND "age" >= 19 AND random() < 0.45
      THEN (ARRAY['stubble','full','goatee'])[floor(random() * 3) + 1]
    ELSE 'none'
  END,
  'glasses', CASE
    WHEN random() < 0.12 THEN 'sun'
    WHEN random() < 0.17 THEN 'round'
    ELSE 'none'
  END,
  'earring', CASE WHEN "gender" = 'female' THEN random() < 0.55 ELSE random() < 0.15 END,
  'shirt', (ARRAY['crew','v','jacket','crew'])[floor(random() * 4) + 1],
  'shirtTone', (ARRAY[4,6,8,10])[floor(random() * 4) + 1]
)`;

/**
 * Adds the stored look of members and former members (`appearance`) and the
 * backdrop of the band's cover photo (`photo_scene`), ADR-0023. Existing rows
 * get random values with the same distributions the app uses, then both
 * columns become `NOT NULL`.
 */
export class AddAppearanceAndPhotoScene1752000026000 implements MigrationInterface {
  /**
   * Applies the migration: adds the columns, backfills them and makes them
   * required.
   *
   * @param queryRunner - Active TypeORM query runner bound to the transaction.
   * @returns A promise that resolves once applied.
   */
  public async up(queryRunner: QueryRunner): Promise<void> {
    for (const table of ["band_members", "former_members"]) {
      await queryRunner.addColumn(
        table,
        new TableColumn({
          name: "appearance",
          type: "jsonb",
          isNullable: true,
        }),
      );
      await queryRunner.query(
        `UPDATE "${table}" SET "appearance" = ${APPEARANCE_SQL}`,
      );
      await queryRunner.query(
        `ALTER TABLE "${table}" ALTER COLUMN "appearance" SET NOT NULL`,
      );
    }

    await queryRunner.addColumn(
      "bands",
      new TableColumn({
        name: "photo_scene",
        type: "varchar",
        length: "16",
        isNullable: true,
      }),
    );
    await queryRunner.query(
      `UPDATE "bands"
       SET "photo_scene" = (ARRAY['ensaio','palco','muro','estudio'])[floor(random() * 4) + 1]`,
    );
    await queryRunner.query(
      `ALTER TABLE "bands" ALTER COLUMN "photo_scene" SET NOT NULL`,
    );
  }

  /**
   * Reverts the migration by dropping the three columns.
   *
   * @param queryRunner - Active TypeORM query runner bound to the transaction.
   * @returns A promise that resolves once dropped.
   */
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("bands", "photo_scene");
    await queryRunner.dropColumn("former_members", "appearance");
    await queryRunner.dropColumn("band_members", "appearance");
  }
}
