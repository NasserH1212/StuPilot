import "server-only";

import { AuthenticationService } from "@/src/modules/authentication/application/authentication-service";
import { AuthenticationError } from "@/src/modules/authentication/application/authentication-error";
import type { ExternalPrincipal } from "@/src/modules/authentication/application/ports/authentication-provider";
import type { Locale } from "@/src/shared/localization/locales";

import {
  clearRecoveryIntent,
  hasRecoveryIntent,
  setRecoveryIntent,
} from "../infrastructure/authentication/recovery-intent";
import { SupabaseAuthenticationProvider } from "../infrastructure/authentication/supabase-authentication-provider";
import { createSupabaseServerClient } from "../infrastructure/authentication/supabase-server-client";
import { getPrismaClient } from "../infrastructure/persistence/prisma/create-prisma-client";
import { PrismaUserIdentityRepository } from "../infrastructure/persistence/prisma/prisma-user-identity-repository";
import { getAuthenticationConfiguration } from "../shared/config/authentication";
import type { AuthenticationEnvironment } from "../shared/config/environment";

export type AuthenticationRuntime =
  | { readonly available: false }
  | {
      readonly available: true;
      readonly environment: AuthenticationEnvironment;
      readonly service: AuthenticationService;
    };

export async function createAuthenticationRuntime(): Promise<AuthenticationRuntime> {
  const configuration = getAuthenticationConfiguration();
  if (!configuration.available) return configuration;

  const providerClient = await createSupabaseServerClient(configuration.environment);
  const provider = new SupabaseAuthenticationProvider(providerClient);
  const prisma = getPrismaClient(configuration.environment.DATABASE_URL);
  const identities = new PrismaUserIdentityRepository(prisma);

  return {
    available: true,
    environment: configuration.environment,
    service: new AuthenticationService(provider, identities),
  };
}

export function authenticationCallbackUrl(
  environment: AuthenticationEnvironment,
  locale: Locale,
): string {
  return new URL(`/${locale}/auth/callback`, environment.AUTH_APP_ORIGIN).toString();
}

export async function recordRecoveryIntent(
  runtime: Extract<AuthenticationRuntime, { available: true }>,
  principal: ExternalPrincipal,
): Promise<void> {
  await setRecoveryIntent(runtime.environment, principal.providerSubject);
}

export async function requireRecoverySession(
  runtime: Extract<AuthenticationRuntime, { available: true }>,
): Promise<void> {
  const session = await runtime.service.currentSession();
  if (
    !session ||
    !(await hasRecoveryIntent(runtime.environment, session.principal.providerSubject))
  ) {
    throw new AuthenticationError(
      "RECOVERY_SESSION_REQUIRED",
      "A valid password-recovery session is required.",
    );
  }
}

export async function consumeRecoveryIntent(
  runtime: Extract<AuthenticationRuntime, { available: true }>,
): Promise<void> {
  await clearRecoveryIntent(runtime.environment);
}
