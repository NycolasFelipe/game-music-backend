import "dotenv/config";
import * as bcrypt from "bcryptjs";
import { UserOrmEntity } from "../../modules/users/infrastructure/persistence/typeorm/user.orm-entity";
import { AppDataSource } from "../data-source";

const DEFAULT_USERNAME = "user";
const DEFAULT_PASSWORD = "user";
const BCRYPT_ROUNDS = 10;

/**
 * Idempotently seeds the default basic user ("user" / "user"). Safe to run
 * repeatedly: it no-ops if the user already exists.
 *
 * @returns A promise that resolves once seeding completes.
 */
async function seed(): Promise<void> {
  const dataSource = await AppDataSource.initialize();

  try {
    const repository = dataSource.getRepository(UserOrmEntity);
    const existing = await repository.findOne({
      where: { username: DEFAULT_USERNAME },
    });

    if (existing) {
      console.log(`Seed skipped: user "${DEFAULT_USERNAME}" already exists.`);
      return;
    }

    const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, BCRYPT_ROUNDS);
    await repository.save(
      repository.create({ username: DEFAULT_USERNAME, passwordHash }),
    );

    console.log(
      `Seed complete: user "${DEFAULT_USERNAME}" created (password: "${DEFAULT_PASSWORD}").`,
    );
  } finally {
    await dataSource.destroy();
  }
}

seed().catch((error: unknown) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
