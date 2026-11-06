import { readFile } from "node:fs/promises";
import path from "node:path";
import { getPool } from "@/lib/db";

let initialized = false;

export async function ensureDatabaseInitialized() {
  if (initialized) return;

  const client = await getPool().connect();

  try {
    const { rowCount } = await client.query(`
      SELECT 1
      FROM information_schema.tables
      WHERE table_schema='public'
      AND table_name='users'
    `);

    if (rowCount) {
      initialized = true;
      return;
    }

    console.log("Initializing database...");

    const sql = await readFile(
      path.join(process.cwd(), "db", "migrations", "001_init.sql"),
      "utf8"
    );

    await client.query(sql);

    initialized = true;

    console.log("Database initialized.");
  } finally {
    client.release();
  }
}