import { readFile } from "node:fs/promises";
import path from "node:path";
import { getPool } from "@/lib/db";

let initialized = false;

export async function ensureDatabaseInitialized() {
  if (initialized) return;

  const client = await getPool().connect();

  try {
    console.log("Checking database initialization...");

    const { rowCount } = await client.query(`
      SELECT 1
      FROM information_schema.tables
      WHERE table_schema='public'
      AND table_name='users'
    `);

    if (rowCount) {
      console.log("Users table already exists.");
      initialized = true;
      return;
    }

    const migrationPath = path.join(
      process.cwd(),
      "db",
      "migrations",
      "001_init.sql"
    );

    console.log("Migration path:", migrationPath);

    const sql = await readFile(migrationPath, "utf8");

    console.log("Migration file loaded.");

    await client.query(sql);

    console.log("Migration executed.");

    initialized = true;
  } catch (err) {
    console.error("DATABASE INITIALIZATION FAILED");
    console.error(err);
    throw err;
  } finally {
    client.release();
  }
}