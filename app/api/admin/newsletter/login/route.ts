import { NextRequest, NextResponse } from "next/server";
import {
  createNewsletterAdminToken,
  NEWSLETTER_ADMIN_COOKIE,
  verifyNewsletterAdminPassword,
} from "../../../../../lib/newsletter/auth";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const password = String(formData.get("password") ?? "");
  const nextPath = String(formData.get("next") ?? "/admin/newsletter");
  const configuredPassword = process.env.ADMIN_NEWSLETTER_PASSWORD;

  if (!configuredPassword) {
    return NextResponse.redirect(
      new URL("/admin/newsletter-login?reason=missing-password", request.url),
      { status: 303 }
    );
  }

  const isValid = await verifyNewsletterAdminPassword(password);

  if (!isValid) {
    const url = new URL("/admin/newsletter-login", request.url);
    url.searchParams.set("error", "invalid");
    url.searchParams.set("next", nextPath);
    return NextResponse.redirect(url, { status: 303 });
  }

  const safeNextPath = nextPath.startsWith("/admin/newsletter")
    ? nextPath
    : "/admin/newsletter";
  const response = NextResponse.redirect(new URL(safeNextPath, request.url), {
    status: 303,
  });

  response.cookies.set({
    name: NEWSLETTER_ADMIN_COOKIE,
    value: await createNewsletterAdminToken(configuredPassword),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  return response;
}
