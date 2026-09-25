export type TermFieldName = "name" | "startsOn" | "endsOn" | "timeZone";

export type TermActionCode =
  "VALIDATION_ERROR" | "UNAVAILABLE" | "NOT_FOUND" | "CONFLICT" | "UNEXPECTED";

export interface TermActionState {
  readonly status: "idle" | "error" | "success";
  readonly code?: TermActionCode;
  readonly fieldErrors?: Readonly<Partial<Record<TermFieldName, true>>>;
}

export const initialTermActionState: TermActionState = { status: "idle" };
