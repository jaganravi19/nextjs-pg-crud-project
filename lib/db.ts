import { Pool } from "pg";

const globalForPg = globalThis as typeof globalThis & {
  pgPool?: Pool;
};

function getEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required database environment variable: ${name}`);
  }

  return value;
}

export const pool =
  globalForPg.pgPool ??
  new Pool({
    host: getEnv("DB_HOST"),
    port: Number(process.env.DB_PORT ?? 5432),
    database: getEnv("DB_NAME"),
    user: getEnv("DB_USER"),
    password: getEnv("DB_PASSWORD"),
    ssl:
      process.env.DB_SSL === "true"
        ? { rejectUnauthorized: true }
        : undefined,
    max: 10,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 5_000,
    application_name: "peopledesk-nextjs",
  });

if (process.env.NODE_ENV !== "production") {
  globalForPg.pgPool = pool;
}