import "dotenv/config";
import { join } from "node:path";
import { DataSource } from "typeorm";

/**
 * Standalone TypeORM DataSource used by the CLI (migrations) and the seed
 * script. The NestJS runtime configures its own connection in DatabaseModule;
 * this instance exists so tooling can run outside the Nest DI container.
 */
export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST ?? "localhost",
  port: Number(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USERNAME ?? "postgres",
  password: process.env.DB_PASSWORD ?? "postgres",
  database: process.env.DB_NAME ?? "game_music",
  entities: [join(__dirname, "..", "modules", "**", "*.orm-entity{.ts,.js}")],
  migrations: [join(__dirname, "migrations", "*{.ts,.js}")],
  synchronize: false,
});
