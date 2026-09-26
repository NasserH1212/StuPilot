import { ApplicationError } from "@/src/shared/errors/application-error";

export const scheduleErrorCodes = [
  "MEETING_NOT_FOUND",
  "MEETING_INVALID",
  "MEETING_VERSION_CONFLICT",
  "MEETING_PERSISTENCE_UNAVAILABLE",
  "OCCURRENCE_WINDOW_END_REQUIRED",
] as const;

export type ScheduleErrorCode = (typeof scheduleErrorCodes)[number];

export class ScheduleError extends ApplicationError {
  declare public readonly code: ScheduleErrorCode;

  public constructor(code: ScheduleErrorCode, message: string, options?: ErrorOptions) {
    super(code, message, options);
    this.name = "ScheduleError";
  }
}

export function isScheduleError(error: unknown): error is ScheduleError {
  return error instanceof ScheduleError;
}
