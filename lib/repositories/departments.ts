import { getPool } from "@/lib/db";
import { ensureDatabaseInitialized } from "@/lib/repositories/db-init";
import type { z } from "zod";
import type { departmentSchema } from "@/lib/validators";

export type DepartmentInput = z.infer<typeof departmentSchema>;

export async function listDepartments() {
  await ensureDatabaseInitialized();

  const pool = getPool();

  const result = await pool.query(
    "SELECT id, name, description FROM departments ORDER BY name"
  );

  return result.rows;
}

export async function getDepartment(id: number) {
  await ensureDatabaseInitialized();

  const pool = getPool();

  const result = await pool.query(
    "SELECT id, name, description FROM departments WHERE id = $1",
    [id]
  );

  return result.rows[0] ?? null;
}

export async function createDepartment(input: DepartmentInput) {
  await ensureDatabaseInitialized();

  const pool = getPool();

  return pool.query(
    "INSERT INTO departments (name, description) VALUES ($1, $2)",
    [input.name, input.description || null]
  );
}

export async function updateDepartment(id: number, input: DepartmentInput) {
  await ensureDatabaseInitialized();

  const pool = getPool();

  return pool.query(
    "UPDATE departments SET name = $1, description = $2 WHERE id = $3",
    [input.name, input.description || null, id]
  );
}

export async function deleteDepartment(id: number) {
  await ensureDatabaseInitialized();

  const pool = getPool();

  return pool.query(
    "DELETE FROM departments WHERE id = $1",
    [id]
  );
}