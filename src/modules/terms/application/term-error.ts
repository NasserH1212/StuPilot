import { ApplicationError } from "@/src/shared/errors/application-error";

export const termErrorCodes = [
  "TERM_NOT_FOUND",
  "TERM_INVALID",
  "TERM_VERSION_CONFLICT",
  "TERM_PERSISTENCE_UNAVAILABLE",
] as const;

export type TermErrorCode = (typeof termErrorCodes)[number];

export class TermError extends ApplicationError {
  declare public readonly code: TermErrorCode;

  public constructor(code: TermErrorCode, message: string, options?: ErrorOptions) {
    super(code, message, options);
    this.name = "TermError";
  }
}

export function isTermError(error: unknown): error is TermError {
  return error instanceof TermError;
}
