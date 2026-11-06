"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { getPool } from "@/lib/db";
import { ensureDatabaseInitialized } from "@/lib/repositories/db-init";

export async function createInitialAdmin(formData: FormData) {
  // Automatically create database tables if they don't exist.
  await ensureDatabaseInitialized();

  const email = String(formData.get("email") || "")
    .trim()
    .toLowerCase();

  const password = String(formData.get("password") || "").trim();

  if (!email || !password) {
    throw new Error("Email and password are required.");
  }

  const pool = getPool();

  const existing = await pool.query(
    "SELECT id FROM users LIMIT 1"
  );

  if (existing.rowCount) {
    redirect("/login");
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await pool.query(
    `
    INSERT INTO users (email, password_hash)
    VALUES ($1, $2)
    `,
    [email, passwordHash]
  );

  redirect("/login");
}