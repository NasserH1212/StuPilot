import { createServerClient } from "@supabase/ssr";
import type { NextRequest, NextResponse } from "next/server";

import type { AuthenticationEnvironment } from "@/src/shared/config/environment";

import { hardenedCookieOptions } from "./supabase-server-client";

export interface SessionRefreshResult {
  readonly authenticated: boolean;
  readonly providerUnavailable: boolean;
}

export async function refreshSupabaseSession(
  request: NextRequest,
  response: NextResponse,
  environment: AuthenticationEnvironment,
): Promise<SessionRefreshResult> {
  const secure = new URL(environment.AUTH_APP_ORIGIN).protocol === "https:";
  const client = createServerClient(
    environment.NEXT_PUBLIC_SUPABASE_URL,
    environment.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookieOptions: {
        httpOnly: true,
        path: "/",
        sameSite: "lax",
        secure,
      },
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet, headersToSet) => {
          for (const cookie of cookiesToSet) {
            request.cookies.set(cookie.name, cookie.value);
            response.cookies.set(
              cookie.name,
              cookie.value,
              hardenedCookieOptions(cookie.options, secure),
            );
          }
          for (const [name, value] of Object.entries(headersToSet)) {
            response.headers.set(name, value);
          }
        },
      },
    },
  );

  try {
    const { data, error } = await client.auth.getClaims();
    if (error) {
      return {
        authenticated: false,
        providerUnavailable: (error.status ?? 0) >= 500,
      };
    }

    return {
      authenticated: Boolean(data?.claims?.sub),
      providerUnavailable: false,
    };
  } catch {
    return { authenticated: false, providerUnavailable: true };
  }
}
