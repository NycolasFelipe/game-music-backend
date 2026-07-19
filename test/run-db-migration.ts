import { PostgreSqlContainer } from "@testcontainers/postgresql";
import { execSync } from "child_process";

async function run() {
  console.log("Starting PostgreSQL container via Testcontainers...");
  const container = await new PostgreSqlContainer("postgres:16-alpine")
    .withDatabase("database")
    .withUsername("postgres")
    .withPassword("postgres")
    .start();

  const host = container.getHost();
  const port = container.getPort();

  process.env.DB_HOST = host;
  process.env.DB_PORT = String(port);
  process.env.DB_USERNAME = container.getUsername();
  process.env.DB_PASSWORD = container.getPassword();
  process.env.DB_NAME = container.getDatabase();

  console.log(`PostgreSQL started at ${host}:${port}`);
  console.log(`Database: ${process.env.DB_NAME}`);
  console.log("Running migrations...");

  let exitCode = 0;

  try {
    // Garante que o dist está atualizado antes de rodar as migrations
    execSync("npm run build", {
      stdio: "inherit",
      env: { ...process.env },
      cwd: process.cwd(),
    });
    execSync("npm run db:migration:run", {
      stdio: "inherit",
      env: { ...process.env },
      cwd: process.cwd(),
    });
    console.log("\n✓ All migrations ran successfully!");
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("\n✗ Migration run failed:", message);
    exitCode = 1;
  } finally {
    console.log("Stopping PostgreSQL container...");
    await container.stop();
    console.log("Container stopped.");
  }

  process.exit(exitCode);
}

run().catch((err) => {
  console.error("Migration test error:", err);
  process.exit(1);
});
