import { NextResponse, type NextRequest } from "next/server";

import { refreshSupabaseSession } from "@/src/infrastructure/authentication/supabase-session-proxy";
import { getAuthenticationConfiguration } from "@/src/shared/config/authentication";
import { defaultLocale, isLocale } from "@/src/shared/localization/locales";
import { localizedPath } from "@/src/shared/localization/routing";

const localeHeader = "x-stupilot-locale";
const nonceHeader = "x-nonce";

function buildContentSecurityPolicy(nonce: string): string {
  const isDev = process.env.NODE_ENV === "development";
  return [
    "default-src 'self'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "object-src 'none'",
    "img-src 'self' data:",
    "font-src 'self'",
    "style-src 'self' 'unsafe-inline'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ""}`,
    "connect-src 'self'",
  ].join("; ");
}

function privateNoStore(response: NextResponse): NextResponse {
  response.headers.set(
    "Cache-Control",
    "private, no-store, no-cache, must-revalidate, max-age=0",
  );
  response.headers.set("Vary", "Cookie");
  return response;
}

function localizedRedirect(
  request: NextRequest,
  pathname: string,
  parameters: Readonly<Record<string, string>> = {},
): NextResponse {
  const destination = request.nextUrl.clone();
  destination.pathname = pathname;
  destination.search = "";
  for (const [name, value] of Object.entries(parameters)) {
    destination.searchParams.set(name, value);
  }
  return privateNoStore(NextResponse.redirect(destination));
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/") {
    return NextResponse.redirect(new URL(`/${defaultLocale}`, request.url));
  }

  const firstSegment = pathname.split("/").filter(Boolean)[0];
  const locale = firstSegment && isLocale(firstSegment) ? firstSegment : defaultLocale;
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const contentSecurityPolicy = buildContentSecurityPolicy(nonce);
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(localeHeader, locale);
  requestHeaders.set("x-stupilot-pathname", pathname);
  requestHeaders.set(nonceHeader, nonce);
  requestHeaders.set("Content-Security-Policy", contentSecurityPolicy);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
  response.headers.set("Content-Security-Policy", contentSecurityPolicy);
  const isPrivateRoute =
    pathname === localizedPath(locale, "workspace") || pathname.includes("/auth/");
  const configuration = getAuthenticationConfiguration();

  if (!configuration.available) {
    if (pathname === localizedPath(locale, "workspace")) {
      return localizedRedirect(
        request,
        localizedPath(locale, "authentication-unavailable"),
        { reason: "configuration" },
      );
    }
    return isPrivateRoute ? privateNoStore(response) : response;
  }

  const session = await refreshSupabaseSession(
    request,
    response,
    configuration.environment,
  );

  if (pathname === localizedPath(locale, "workspace")) {
    if (session.providerUnavailable) {
      return localizedRedirect(
        request,
        localizedPath(locale, "authentication-unavailable"),
        { reason: "provider" },
      );
    }
    if (!session.authenticated) {
      return localizedRedirect(request, localizedPath(locale, "sign-in"), {
        returnTo: localizedPath(locale, "workspace"),
      });
    }
  }

  return isPrivateRoute ? privateNoStore(response) : response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
