import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const hasSessionCookie = Boolean(request.cookies.get("session")?.value);
  if (!hasSessionCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}

export const config = { matcher: ["/dashboard/:path*"] };
