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
  ssl: process.env.DB_SSL === "true"
    ? { rejectUnauthorized: true }
    : undefined,
});

async function bootstrapAdmin() {
  // Hardcoded admin credentials
  const email = "admin@example.com";
  const password = "Admin123456789!";

  const oneTimeCode = randomBytes(24).toString("base64url");
  const passwordHash = await bcrypt.hash(password, 12);
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const { rowCount } = await client.query(
      "SELECT 1 FROM users LIMIT 1"
    );

    if (rowCount) {
      throw new Error(
        "An account already exists. Bootstrap only creates the initial administrator."
      );
    }

    await client.query(
      "INSERT INTO users (email, password_hash) VALUES ($1, $2)",
      [email, passwordHash]
    );

    await client.query("COMMIT");

    console.log("======================================");
    console.log("Administrator account created!");
    console.log("======================================");
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    console.log("======================================");
    console.log("One-time setup code:");
    console.log(oneTimeCode);
    console.log("======================================");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

bootstrapAdmin()
  .catch((error: unknown) => {
    const message =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Admin bootstrap failed:", message);
    process.exitCode = 1;
  })
  .finally(() => pool.end());