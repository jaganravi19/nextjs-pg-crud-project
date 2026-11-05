import { NextResponse } from "next/server";

export function errorResponse(error: unknown) {
  if (
    error &&
    typeof error === "object" &&
    "code" in error &&
    (error as { code?: string }).code === "23505"
  ) {
    return NextResponse.json(
      { error: "A record with that value already exists." },
      { status: 409 },
    );
  }

  console.error("Unhandled request error", error);
  return NextResponse.json(
    { error: "Request could not be completed." },
    { status: 500 },
  );
}
