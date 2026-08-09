import {
  parseAuthenticationEnvironment,
  type AuthenticationEnvironment,
} from "./environment";

export type AuthenticationConfiguration =
  | { readonly available: true; readonly environment: AuthenticationEnvironment }
  | { readonly available: false };

export function getAuthenticationConfiguration(): AuthenticationConfiguration {
  const candidate = {
    AUTH_APP_ORIGIN: process.env.AUTH_APP_ORIGIN,
    AUTH_STATE_SECRET: process.env.AUTH_STATE_SECRET,
    DATABASE_URL: process.env.DATABASE_URL,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  };

  try {
    return {
      available: true,
      environment: parseAuthenticationEnvironment(candidate),
    };
  } catch {
    return { available: false };
  }
}
