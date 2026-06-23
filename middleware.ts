import { NextRequest, NextResponse } from "next/server";
import {
  getExpectedNewsletterAdminToken,
  NEWSLETTER_ADMIN_COOKIE,
} from "./lib/newsletter/auth";

export async function middleware(request: NextRequest) {
  const expectedToken = await getExpectedNewsletterAdminToken();
  const loginUrl = new URL("/admin/newsletter-login", request.url);

  if (!expectedToken) {
    loginUrl.searchParams.set("reason", "missing-password");
    return NextResponse.redirect(loginUrl);
  }

  const currentToken = request.cookies.get(NEWSLETTER_ADMIN_COOKIE)?.value;

  if (currentToken !== expectedToken) {
    loginUrl.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/newsletter", "/admin/newsletter/:path*"],
};
