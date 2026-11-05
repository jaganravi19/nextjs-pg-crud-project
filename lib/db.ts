import { Pool } from "pg";

const requiredDatabaseVariables = ["DB_HOST", "DB_NAME", "DB_USER", "DB_PASSWORD"] as const;

for (const name of requiredDatabaseVariables) {
  if (!process.env[name]) {
    throw new Error(`Missing required database environment variable: ${name}`);
  }
}

const globalForPg = globalThis as typeof globalThis & { pgPool?: Pool };

export const pool =
  globalForPg.pgPool ??
  new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT ?? 5432),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
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
