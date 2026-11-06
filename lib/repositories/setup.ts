import bcrypt from "bcryptjs";
import { getPool } from "@/lib/db";

let initialized = false;

export async function ensureDatabaseSetup() {
  if (initialized) return;
  initialized = true;

  const pool = getPool();

  // Create users table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id BIGSERIAL PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'admin'
        CHECK (role IN ('admin')),
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);

  // Create departments table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS departments (
      id BIGSERIAL PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      description TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);

  // Create employees table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS employees (
      id BIGSERIAL PRIMARY KEY,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      phone TEXT,
      job_title TEXT NOT NULL,
      department_id BIGINT
        REFERENCES departments(id)
        ON DELETE SET NULL,
      hire_date DATE,
      status TEXT NOT NULL DEFAULT 'active'
        CHECK (status IN ('active','inactive')),
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);

  await pool.query(`
    CREATE INDEX IF NOT EXISTS employees_name_idx
    ON employees(last_name, first_name);
  `);

  await pool.query(`
    CREATE INDEX IF NOT EXISTS employees_department_idx
    ON employees(department_id);
  `);

  // Check whether an admin user already exists
  const { rowCount } = await pool.query(
    "SELECT id FROM users LIMIT 1"
  );

  if (!rowCount) {
    const passwordHash = await bcrypt.hash(
      "Admin123456789!",
      12
    );

    await pool.query(
      `
      INSERT INTO users
      (email, password_hash, role)
      VALUES ($1, $2, 'admin')
      `,
      [
        "admin@example.com",
        passwordHash
      ]
    );

    console.log("✅ Default admin user created.");
  }

  console.log("✅ Database setup completed.");
}