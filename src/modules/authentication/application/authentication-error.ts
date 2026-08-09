import { ApplicationError } from "@/src/shared/errors/application-error";

export const authenticationErrorCodes = [
  "CONFIGURATION_UNAVAILABLE",
  "INVALID_CREDENTIALS",
  "EMAIL_NOT_VERIFIED",
  "LINK_INVALID",
  "LINK_EXPIRED_OR_USED",
  "RATE_LIMITED",
  "PROVIDER_UNAVAILABLE",
  "UNAUTHORIZED",
  "ACCOUNT_UNAVAILABLE",
  "RECOVERY_SESSION_REQUIRED",
  "UNEXPECTED_AUTHENTICATION_ERROR",
] as const;

export type AuthenticationErrorCode = (typeof authenticationErrorCodes)[number];

export class AuthenticationError extends ApplicationError {
  declare public readonly code: AuthenticationErrorCode;

  public constructor(
    code: AuthenticationErrorCode,
    message: string,
    options?: ErrorOptions,
  ) {
    super(code, message, options);
    this.name = "AuthenticationError";
  }
}

export function isAuthenticationError(error: unknown): error is AuthenticationError {
  return error instanceof AuthenticationError;
}
