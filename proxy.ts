import { NextResponse, type NextRequest } from "next/server";

import { defaultLocale, isLocale } from "@/src/shared/localization/locales";

const localeHeader = "x-studenthub-locale";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/") {
    return NextResponse.redirect(new URL(`/${defaultLocale}`, request.url));
  }

  const firstSegment = pathname.split("/").filter(Boolean)[0];
  const locale = firstSegment && isLocale(firstSegment) ? firstSegment : defaultLocale;
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(localeHeader, locale);
  requestHeaders.set("x-studenthub-pathname", pathname);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)"],
};
