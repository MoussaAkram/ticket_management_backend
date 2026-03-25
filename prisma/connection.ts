/**
 * Builds the PostgreSQL connection string from individual env vars.
 * Used by both prisma.config.ts (CLI) and PrismaClient instances (runtime).
 * Single place to change if the connection format ever changes.
 */
export function buildConnectionString(): string {
  const user = process.env.DATABASE_USER;
  const password = process.env.DATABASE_PASSWORD;
  const host = process.env.DATABASE_HOST;
  const port = process.env.DATABASE_PORT;
  const name = process.env.DATABASE_NAME;
  return `postgresql://${user}:${password}@${host}:${port}/${name}`;
}
