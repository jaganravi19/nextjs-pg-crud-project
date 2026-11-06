import { redirect } from "next/navigation";
import { getPool } from "@/lib/db";
import { login } from "./actions";

export default async function Login({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const pool = getPool();

  const result = await pool.query("SELECT COUNT(*)::int AS count FROM users");

  if (result.rows[0].count === 0) {
    redirect("/setup");
  }

  const { error } = await searchParams;

  return (
    <main className="wrap">
      <section className="card login">
        <h1>PeopleDesk</h1>

        <p className="muted">
          Sign in to manage your team.
        </p>

        {error && <p className="notice">{error}</p>}

        <form action={login} className="stack">
          <label className="field">
            Email
            <input
              name="email"
              type="email"
              autoComplete="username"
              required
            />
          </label>

          <label className="field">
            Password
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              required
            />
          </label>

          <button>Sign in</button>
        </form>
      </section>
    </main>
  );
}