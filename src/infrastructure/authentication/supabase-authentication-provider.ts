import "server-only";

import type { AuthError, SupabaseClient, User } from "@supabase/supabase-js";

import {
  AuthenticationError,
  isAuthenticationError,
} from "@/src/modules/authentication/application/authentication-error";
import type {
  AuthenticationLinkIntent,
  AuthenticationProvider,
  ExternalPrincipal,
  PasswordRecoveryRequest,
  RegistrationRequest,
  SignInRequest,
} from "@/src/modules/authentication/application/ports/authentication-provider";

const providerKey = "supabase";

type ProviderOperation =
  | "register"
  | "sign_in"
  | "verify_link"
  | "session"
  | "password_recovery"
  | "update_password"
  | "sign_out";

function providerErrorCode(error: AuthError): string | undefined {
  return "code" in error && typeof error.code === "string" ? error.code : undefined;
}

export function translateSupabaseAuthError(
  error: AuthError,
  operation: ProviderOperation,
): AuthenticationError {
  const code = providerErrorCode(error);

  if (
    error.status === 429 ||
    code === "over_email_send_rate_limit" ||
    code === "over_request_rate_limit"
  ) {
    return new AuthenticationError(
      "RATE_LIMITED",
      "The authentication provider rate limit was reached.",
      { cause: error },
    );
  }

  if (operation === "verify_link") {
    if (
      code === "otp_expired" ||
      code === "flow_state_expired" ||
      code === "bad_code_verifier"
    ) {
      return new AuthenticationError(
        "LINK_EXPIRED_OR_USED",
        "The authentication link is expired or has already been used.",
        { cause: error },
      );
    }

    return new AuthenticationError(
      "LINK_INVALID",
      "The authentication link is invalid.",
      { cause: error },
    );
  }

  if (
    code === "invalid_credentials" ||
    code === "user_not_found" ||
    code === "invalid_grant"
  ) {
    return new AuthenticationError(
      "INVALID_CREDENTIALS",
      "The supplied credentials were not accepted.",
      { cause: error },
    );
  }

  if (code === "email_not_confirmed") {
    return new AuthenticationError(
      "EMAIL_NOT_VERIFIED",
      "The email address has not been verified.",
      { cause: error },
    );
  }

  if (
    operation === "session" &&
    (code === "session_not_found" ||
      code === "refresh_token_not_found" ||
      code === "refresh_token_already_used" ||
      code === "bad_jwt")
  ) {
    return new AuthenticationError(
      "UNAUTHORIZED",
      "No valid provider session is available.",
      { cause: error },
    );
  }

  if ((error.status ?? 0) >= 500 || error.status === 0) {
    return new AuthenticationError(
      "PROVIDER_UNAVAILABLE",
      "The authentication provider is unavailable.",
      { cause: error },
    );
  }

  return new AuthenticationError(
    "UNEXPECTED_AUTHENTICATION_ERROR",
    `The authentication provider rejected the ${operation} operation.`,
    { cause: error },
  );
}

function toPrincipal(user: User): ExternalPrincipal {
  const verifiedAt = user.email_confirmed_at;
  if (!verifiedAt) {
    throw new AuthenticationError(
      "EMAIL_NOT_VERIFIED",
      "The provider identity does not have a verified email.",
    );
  }

  return {
    providerKey,
    providerSubject: user.id,
    ...(user.email ? { verifiedEmailSnapshot: user.email.trim().toLowerCase() } : {}),
    emailVerifiedAt: new Date(verifiedAt),
  };
}

function linkType(intent: AuthenticationLinkIntent): "email" | "recovery" {
  return intent === "email_verification" ? "email" : "recovery";
}

export class SupabaseAuthenticationProvider implements AuthenticationProvider {
  public constructor(private readonly client: SupabaseClient) {}

  public async register(request: RegistrationRequest): Promise<void> {
    await this.execute("register", async () => {
      const { data, error } = await this.client.auth.signUp({
        email: request.email,
        password: request.password,
        options: { emailRedirectTo: request.verificationCallbackUrl },
      });

      if (error) {
        const code = providerErrorCode(error);
        if (code === "user_already_exists" || code === "email_exists") return;
        throw translateSupabaseAuthError(error, "register");
      }

      if (data.session || data.user?.email_confirmed_at) {
        await this.client.auth.signOut({ scope: "local" });
        throw new AuthenticationError(
          "PROVIDER_UNAVAILABLE",
          "Email verification is not enforced by the provider configuration.",
        );
      }
    });
  }

  public async signIn(request: SignInRequest): Promise<ExternalPrincipal> {
    return this.execute("sign_in", async () => {
      const { data, error } = await this.client.auth.signInWithPassword(request);
      if (error) throw translateSupabaseAuthError(error, "sign_in");
      return toPrincipal(data.user);
    });
  }

  public async verifyLink(
    tokenHash: string,
    intent: AuthenticationLinkIntent,
  ): Promise<ExternalPrincipal> {
    return this.execute("verify_link", async () => {
      const { data, error } = await this.client.auth.verifyOtp({
        token_hash: tokenHash,
        type: linkType(intent),
      });
      if (error) throw translateSupabaseAuthError(error, "verify_link");
      if (!data.user) {
        throw new AuthenticationError(
          "LINK_INVALID",
          "The provider did not return a user for the authentication link.",
        );
      }
      return toPrincipal(data.user);
    });
  }

  public async getCurrentPrincipal(): Promise<ExternalPrincipal | null> {
    try {
      const { data, error } = await this.client.auth.getUser();
      if (error) {
        const translated = translateSupabaseAuthError(error, "session");
        if (translated.code === "UNAUTHORIZED") return null;
        throw translated;
      }
      return data.user ? toPrincipal(data.user) : null;
    } catch (error) {
      if (isAuthenticationError(error)) throw error;
      throw new AuthenticationError(
        "PROVIDER_UNAVAILABLE",
        "The authentication provider session could not be validated.",
        { cause: error },
      );
    }
  }

  public async requestPasswordRecovery(
    request: PasswordRecoveryRequest,
  ): Promise<void> {
    await this.execute("password_recovery", async () => {
      const { error } = await this.client.auth.resetPasswordForEmail(request.email, {
        redirectTo: request.recoveryCallbackUrl,
      });
      if (error) {
        const code = providerErrorCode(error);
        if (code === "user_not_found") return;
        throw translateSupabaseAuthError(error, "password_recovery");
      }
    });
  }

  public async updatePassword(password: string): Promise<void> {
    await this.execute("update_password", async () => {
      const { error } = await this.client.auth.updateUser({ password });
      if (error) throw translateSupabaseAuthError(error, "update_password");
    });
  }

  public async signOut(): Promise<void> {
    await this.execute("sign_out", async () => {
      // Revoke all refresh-token families for this provider user; do not merely
      // remove the browser cookie. Hosted revocation behavior remains evidence-gated.
      const { error } = await this.client.auth.signOut({ scope: "global" });
      if (error) throw translateSupabaseAuthError(error, "sign_out");
    });
  }

  private async execute<T>(
    operation: ProviderOperation,
    action: () => Promise<T>,
  ): Promise<T> {
    try {
      return await action();
    } catch (error) {
      if (isAuthenticationError(error)) throw error;
      throw new AuthenticationError(
        "PROVIDER_UNAVAILABLE",
        `The authentication provider could not complete ${operation}.`,
        { cause: error },
      );
    }
  }
}
