import { getPool } from "@/lib/db";
import type { z } from "zod";
import type { employeeSchema } from "@/lib/validators";

export type EmployeeInput = z.infer<typeof employeeSchema>;

const employeeColumns = `
  e.id, e.first_name, e.last_name, e.email, e.phone, e.job_title,
  e.department_id, e.hire_date, e.status, e.created_at, e.updated_at,
  d.name AS department_name
`;

export async function listEmployees(options: {
  search: string;
  limit: number;
  offset: number;
}) {
  const pool = getPool();
  const pattern = `%${options.search}%`;

  return pool.query(
    `SELECT ${employeeColumns}
       FROM employees e
       LEFT JOIN departments d ON d.id = e.department_id
      WHERE ($1 = '' OR e.first_name ILIKE $2 OR e.last_name ILIKE $2
        OR e.email ILIKE $2 OR e.job_title ILIKE $2)
      ORDER BY e.created_at DESC
      LIMIT $3 OFFSET $4`,
    [options.search, pattern, options.limit, options.offset],
  );
}

export async function countEmployees(search: string) {
  const pool = getPool();
  const pattern = `%${search}%`;

  const result = await pool.query(
    `SELECT count(*)::int AS total
       FROM employees
      WHERE ($1 = '' OR first_name ILIKE $2 OR last_name ILIKE $2
        OR email ILIKE $2 OR job_title ILIKE $2)`,
    [search, pattern],
  );

  return Number(result.rows[0].total);
}

export async function getEmployee(id: number) {
  const pool = getPool();

  const result = await pool.query(
    `SELECT id, first_name, last_name, email, phone, job_title,
            department_id, hire_date, status
       FROM employees
      WHERE id = $1`,
    [id],
  );

  return result.rows[0] ?? null;
}

export async function createEmployee(input: EmployeeInput) {
  const pool = getPool();

  return pool.query(
    `INSERT INTO employees
      (first_name, last_name, email, phone, job_title, department_id, hire_date, status)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [
      input.firstName,
      input.lastName,
      input.email.toLowerCase(),
      input.phone || null,
      input.jobTitle,
      input.departmentId || null,
      input.hireDate || null,
      input.status,
    ],
  );
}

export async function updateEmployee(id: number, input: EmployeeInput) {
  const pool = getPool();

  return pool.query(
    `UPDATE employees
        SET first_name = $1,
            last_name = $2,
            email = $3,
            phone = $4,
            job_title = $5,
            department_id = $6,
            hire_date = $7,
            status = $8,
            updated_at = now()
      WHERE id = $9`,
    [
      input.firstName,
      input.lastName,
      input.email.toLowerCase(),
      input.phone || null,
      input.jobTitle,
      input.departmentId || null,
      input.hireDate || null,
      input.status,
      id,
    ],
  );
}

export async function deleteEmployee(id: number) {
  const pool = getPool();
  return pool.query("DELETE FROM employees WHERE id = $1", [id]);
}