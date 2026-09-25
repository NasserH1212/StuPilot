import type { AuthenticationErrorCode } from "@/src/modules/authentication/application/authentication-error";

export type AuthFieldError =
  "INVALID_EMAIL" | "PASSWORD_REQUIREMENTS" | "PASSWORDS_DO_NOT_MATCH";

export interface AuthActionState {
  readonly status: "idle" | "error" | "success";
  readonly code?: AuthenticationErrorCode | "VALIDATION_ERROR";
  readonly fieldErrors?: Readonly<
    Partial<Record<"email" | "password" | "confirmPassword", AuthFieldError>>
  >;
}

export const initialAuthActionState: AuthActionState = { status: "idle" };
