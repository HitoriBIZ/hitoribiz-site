import { NextRequest, NextResponse } from "next/server";
import { NEWSLETTER_ADMIN_COOKIE } from "../../../../../lib/newsletter/auth";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const response = NextResponse.redirect(
    new URL("/admin/newsletter-login", request.url),
    { status: 303 }
  );

  response.cookies.set({
    name: NEWSLETTER_ADMIN_COOKIE,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });

  return response;
}
