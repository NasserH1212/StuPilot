export type ClassMeetingFieldName =
  "weekdays" | "localStartTime" | "localEndTime" | "location" | "meetingType";

export type ClassMeetingActionCode =
  | "VALIDATION_ERROR"
  | "UNAVAILABLE"
  | "TERM_NOT_FOUND"
  | "NOT_FOUND"
  | "CONFLICT"
  | "UNEXPECTED";

export interface ClassMeetingActionState {
  readonly status: "idle" | "error" | "success";
  readonly code?: ClassMeetingActionCode;
  readonly fieldErrors?: Readonly<Partial<Record<ClassMeetingFieldName, true>>>;
}

export const initialClassMeetingActionState: ClassMeetingActionState = {
  status: "idle",
};
