"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { getPool } from "@/lib/db";
import { createSession } from "@/lib/auth";
import { ensureDatabaseInitialized } from "@/lib/repositories/db-init";

export async function login(form: FormData) {
  // Automatically create database tables if they don't exist.
  await ensureDatabaseInitialized();

  const pool = getPool();

  const email = String(form.get("email") || "")
    .trim()
    .toLowerCase();

  const password = String(form.get("password") || "");

  const result = await pool.query(
    `
    SELECT id, email, password_hash
    FROM users
    WHERE email = $1
    `,
    [email]
  );

  const user = result.rows[0];

  if (
    !user ||
    !(await bcrypt.compare(password, user.password_hash))
  ) {
    redirect("/login?error=Invalid%20email%20or%20password");
  }

  await createSession({
    id: String(user.id),
    email: user.email,
  });

  redirect("/dashboard");
}