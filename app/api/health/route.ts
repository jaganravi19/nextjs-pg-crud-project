import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";

export async function GET() {
  try {
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