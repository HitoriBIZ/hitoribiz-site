import { NextRequest, NextResponse } from "next/server";
import {
  getExpectedNewsletterAdminToken,
  NEWSLETTER_ADMIN_COOKIE,
} from "./lib/newsletter/auth";

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === "/en" || request.nextUrl.pathname.startsWith("/en/")) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-hitoribiz-locale", "en");
    const response = NextResponse.next({ request: { headers: requestHeaders } });
    response.headers.set("Content-Language", "en");
    return response;
  }

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
  matcher: ["/en", "/en/:path*", "/admin/newsletter", "/admin/newsletter/:path*"],
};
