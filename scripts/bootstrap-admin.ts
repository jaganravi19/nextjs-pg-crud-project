import { randomBytes } from "node:crypto";
import { config } from "dotenv";
import bcrypt from "bcryptjs";
import { Pool } from "pg";

config({ path: [".env.local", ".env"] });

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT ?? 5432),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: true } : undefined,
});

async function bootstrapAdmin() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password || password.length < 12) {
    throw new Error(
      "Set ADMIN_EMAIL and ADMIN_PASSWORD (at least 12 characters) in the private terminal environment.",
    );
  }

  const oneTimeCode = randomBytes(24).toString("base64url");
  const passwordHash = await bcrypt.hash(password, 12);
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const { rowCount } = await client.query("SELECT 1 FROM users LIMIT 1");
    if (rowCount) {
      throw new Error("An account already exists. Bootstrap only creates the initial administrator.");
    }

    await client.query(
      "INSERT INTO users (email, password_hash) VALUES ($1, $2)",
      [email, passwordHash],
    );
    await client.query("COMMIT");

    console.log(`Administrator account created for ${email}.`);
    console.log("One-time setup code (store securely; it is not saved):");
    console.log(oneTimeCode);
    console.log("Use the ADMIN_PASSWORD value to sign in. The setup code is for secure handoff.");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

bootstrapAdmin()
  .catch((error: unknown) => {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Admin bootstrap failed:", message);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
