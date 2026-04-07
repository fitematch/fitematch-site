import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import {
  defaultLocale,
  getLocaleFromPathname,
  isLocale,
  localeCookieName,
  localizePath,
} from "./src/i18n/config";

export function middleware(request: NextRequest) {
  const { nextUrl } = request;
  const { pathname } = nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  const pathnameLocale = getLocaleFromPathname(pathname);

  if (pathnameLocale) {
    const response = NextResponse.next();
    response.cookies.set(localeCookieName, pathnameLocale);
    return response;
  }

  const cookieLocale = request.cookies.get(localeCookieName)?.value;
  const locale = cookieLocale && isLocale(cookieLocale) ? cookieLocale : defaultLocale;
  const redirectUrl = nextUrl.clone();
  redirectUrl.pathname = localizePath(pathname, locale);

  return NextResponse.redirect(redirectUrl);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
