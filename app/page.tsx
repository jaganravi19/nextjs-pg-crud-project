import { redirect } from "next/navigation";
import { getPool } from "@/lib/db";

export default async function Home() {
  const pool = getPool();

  const result = await pool.query(
    "SELECT COUNT(*)::int AS count FROM users"
  );

  if (result.rows[0].count === 0) {
    redirect("/setup");
  }

  redirect("/login");
}