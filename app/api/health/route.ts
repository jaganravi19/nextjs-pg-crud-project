import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { ensureDatabaseInitialized } from "@/lib/repositories/db-init";

export async function GET() {
  try {
    await ensureDatabaseInitialized();

    const pool = getPool();

    await pool.query("SELECT 1");

    return NextResponse.json({
      status: "ok",
      database: "connected",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        status: "error",
        database: "disconnected",
      },
      { status: 500 }
    );
  }
}