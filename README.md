# PeopleDesk — Next.js + PostgreSQL CRUD

An intermediate-level employee and department management application built with Next.js App Router, TypeScript, Node.js, and PostgreSQL using `pg` directly. It does not use an ORM.

## Features

- Email/password administrator sign-in with bcrypt password hashing and signed, HTTP-only, same-site cookies
- Protected dashboard with employee and department CRUD
- Employee search, pagination, status, department assignment, and server-side validation
- Parameterized SQL queries, PostgreSQL connection pool, health endpoint
- Versioned SQL migrations and an initial administrator bootstrap script

## Requirements

- Node.js 20.9 or newer
- npm
- PostgreSQL 14 or newer, reachable from the application host

## Database connection setup

The PostgreSQL resource is `quantumbiz-auth-staging`. Configure the application to use its **private hostname** and port `5432`. Do not use a public hostname for the application-to-database connection.

This project cannot inspect your hosting account, so it cannot confirm the database username or whether the database already exists. In the hosting console, open the PostgreSQL resource and copy its assigned username and existing database name. If there is no application database, create one in the resource console or ask its administrator to create one and grant the application user access. Set `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, and `DB_PASSWORD` in the application service's Secrets/environment settings.

Most platforms expose each application Secret as a runtime environment variable with the same name, but the exact behavior depends on the platform. Confirm this in that platform's application/runtime documentation or by checking the configured runtime environment without printing secret values.

## Install and configure

```sh
cp .env.example .env.local
npm install
```

Set the values in `.env.local` for local development. Generate `JWT_SECRET` with a cryptographically secure random value of at least 32 characters (for example, `openssl rand -base64 32`). Never commit `.env.local` or put real credentials in `.env.example`. For deployment, add the same variable names as private application Secrets. Set `DB_SSL=true` only when your database provider requires TLS and its certificate is trusted by the runtime.

## Migrate the database

Run from the project directory in a private application terminal where the database is reachable and the `DB_*` environment variables are present:

```sh
npm run db:migrate
```

The migration runner applies sorted `.sql` files once and records successful migrations in `schema_migrations`. If the provider supplies a terminal that does not inherit application Secrets, attach/select the app's private environment or inject the same variables into that terminal securely. Never paste database passwords into chat or commit them.

## Bootstrap the initial administrator

In that same private application terminal, securely set `ADMIN_EMAIL` and `ADMIN_PASSWORD` (minimum 12 characters), then run:

```sh
npm run admin:bootstrap
```

The script creates the first admin only when the users table is empty, hashes the password, and prints a random one-time setup code. Capture the code from the private terminal and store it in your approved password manager/secret store. The code is not written to the database or logs by the application; it is a handoff token and is not used for login. The bootstrap password is the actual login credential. Do not share either value in a public log, repository, or chat. The command refuses to create a second initial account.

If you need to rotate the admin password later, use a controlled password reset procedure; do not rerun bootstrap to overwrite an account.

## Run locally

```sh
npm run dev
```

Open http://localhost:3000 and sign in using the bootstrap email and password. Build and run in production with `npm run build` and `npm start`. The health check is `GET /api/health`.

## Project structure

```text
app/                    Next.js pages, Server Actions, and health API
  dashboard/            Protected employee and department screens
  login/                 Sign-in screen and action
db/migrations/          Versioned PostgreSQL SQL migrations
lib/                    Database pool, auth, validation, HTTP helpers
scripts/                Migration and initial admin commands
.env.example             Environment variable template
````

## Application layers

- **Pages and components** render server-side screens and reusable forms.
- **Server Actions** are the mutation boundary: each write checks the session, validates input with Zod, revalidates the dashboard, and redirects after success.
- **Repositories** contain the PostgreSQL queries and map app operations to parameterized SQL.
- **Shared libraries** provide connection pooling, session signing, and validation schemas.

## Data and security notes

- All database values are passed as query parameters; SQL strings do not interpolate user values.
- Session cookies are HTTP-only and `SameSite=Lax`; production cookies are marked Secure.
- Use HTTPS in production, a least-privilege database account, strong secrets, and network rules that allow only the application to reach the private database endpoint.
- The middleware checks for the presence of a session cookie for a quick redirect; the dashboard also verifies the signed token before loading private data.
- Error responses avoid returning SQL/internal error details. Review provider logs privately when diagnosing failures.
- This is a practical starter app. Add rate limiting, audit logging, backup/restore procedures, and formal password reset before exposing it broadly.

## API / server behavior

Most CRUD operations use Next.js Server Actions and render on the server. The health route returns only basic application/database status. Server Actions validate submissions, enforce the signed-in session, then call the repository layer. Parameterized SQL and persistence queries live in `lib/repositories/` and use `pg` directly.
