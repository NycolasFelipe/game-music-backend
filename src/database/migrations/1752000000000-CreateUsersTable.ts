import { MigrationInterface, QueryRunner, Table } from "typeorm";

/**
 * Creates the `users` table backing basic username/password authentication.
 */
export class CreateUsersTable1752000000000 implements MigrationInterface {
  /**
   * Applies the migration: enables the uuid extension and creates `users`.
   *
   * @param queryRunner - Active TypeORM query runner bound to the transaction.
   * @returns A promise that resolves once the schema changes are applied.
   */
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    await queryRunner.createTable(
      new Table({
        name: "users",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            default: "uuid_generate_v4()",
          },
          {
            name: "username",
            type: "varchar",
            length: "255",
            isUnique: true,
          },
          {
            name: "password_hash",
            type: "varchar",
            length: "255",
          },
          {
            name: "created_at",
            type: "timestamptz",
            default: "now()",
          },
          {
            name: "updated_at",
            type: "timestamptz",
            default: "now()",
          },
        ],
      }),
      true,
    );
  }

  /**
   * Reverts the migration by dropping the `users` table.
   *
   * @param queryRunner - Active TypeORM query runner bound to the transaction.
   * @returns A promise that resolves once the table is dropped.
   */
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("users");
  }
}
