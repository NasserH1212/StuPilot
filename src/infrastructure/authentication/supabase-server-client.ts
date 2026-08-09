import "server-only";

import { createServerClient, type CookieOptions } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

import type { AuthenticationEnvironment } from "@/src/shared/config/environment";

function hardenedCookieOptions(options: CookieOptions, secure: boolean): CookieOptions {
  return {
    ...options,
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure,
  };
}

export async function createSupabaseServerClient(
  environment: AuthenticationEnvironment,
): Promise<SupabaseClient> {
  const cookieStore = await cookies();
  const secure = new URL(environment.AUTH_APP_ORIGIN).protocol === "https:";

  return createServerClient(
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
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          for (const cookie of cookiesToSet) {
            cookieStore.set(
              cookie.name,
              cookie.value,
              hardenedCookieOptions(cookie.options, secure),
            );
          }
        },
      },
    },
  );
}

export { hardenedCookieOptions };
