"use server";

import { z } from "zod";

import { createAuthenticationRuntime } from "@/src/composition/authentication";
import { createScheduleService } from "@/src/composition/schedule";
import { createTermService } from "@/src/composition/terms";
import { isScheduleError } from "@/src/modules/schedule/application/schedule-error";
import {
  classMeetingTypes,
  type Weekday,
} from "@/src/modules/schedule/domain/class-meeting";

import type {
  ClassMeetingActionState,
  ClassMeetingFieldName,
} from "./class-meeting-action-state";

const idSchema = z.string().uuid();
const weekdaySchema = z.coerce.number().int().min(0).max(6);
const localTimeSchema = z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/);
const locationSchema = z.string().trim().max(120);
const meetingTypeSchema = z.enum(classMeetingTypes);

function fieldValue(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

/** Reads one or more same-named "weekdays" fields (e.g. a checkbox group). */
function parseWeekdays(formData: FormData): readonly Weekday[] | null {
  const raw = formData
    .getAll("weekdays")
    .filter((value): value is string => typeof value === "string");
  if (raw.length === 0) return null;

  const parsed = raw.map((value) => weekdaySchema.safeParse(value));
  if (parsed.some((result) => !result.success)) return null;

  return parsed.map((result) => (result as { data: number }).data as Weekday);
}

type ResolvedTerm = {
  readonly startsOn: Date;
  readonly endsOn: Date;
  readonly timeZone: string;
};
type TermLookup =
  { readonly term: ResolvedTerm } | { readonly error: ClassMeetingActionState };

async function requireOwnedTerm(userId: string, termId: string): Promise<TermLookup> {
  let term;
  try {
    term = await createTermService().getTerm(userId, termId);
  } catch {
    return { error: { status: "error", code: "UNAVAILABLE" } };
  }
  if (!term) return { error: { status: "error", code: "TERM_NOT_FOUND" } };

  return {
    term: { startsOn: term.startsOn, endsOn: term.endsOn, timeZone: term.timeZone },
  };
}

type AccountLookup =
  | { readonly account: { readonly id: string } }
  | { readonly error: ClassMeetingActionState };

async function currentAccountOrError(): Promise<AccountLookup> {
  const authentication = await createAuthenticationRuntime();
  if (!authentication.available) {
    return { error: { status: "error", code: "UNAVAILABLE" } };
  }

  let account;
  try {
    account = await authentication.service.currentAccount();
  } catch {
    return { error: { status: "error", code: "UNAVAILABLE" } };
  }
  if (!account) return { error: { status: "error", code: "UNAVAILABLE" } };

  return { account };
}

function toActionError(error: unknown): ClassMeetingActionState {
  if (isScheduleError(error)) {
    if (error.code === "MEETING_NOT_FOUND")
      return { status: "error", code: "NOT_FOUND" };
    if (error.code === "MEETING_VERSION_CONFLICT") {
      return { status: "error", code: "CONFLICT" };
    }
    if (error.code === "MEETING_INVALID") {
      return { status: "error", code: "VALIDATION_ERROR" };
    }
  }
  return { status: "error", code: "UNAVAILABLE" };
}

export async function createClassMeetingAction(
  _state: ClassMeetingActionState,
  formData: FormData,
): Promise<ClassMeetingActionState> {
  const termId = idSchema.safeParse(fieldValue(formData, "termId"));
  const userCourseId = idSchema.safeParse(fieldValue(formData, "userCourseId"));
  const weekdays = parseWeekdays(formData);
  const localStartTime = localTimeSchema.safeParse(
    fieldValue(formData, "localStartTime"),
  );
  const localEndTime = localTimeSchema.safeParse(fieldValue(formData, "localEndTime"));
  const location = locationSchema.safeParse(fieldValue(formData, "location"));
  const meetingType = meetingTypeSchema.safeParse(fieldValue(formData, "meetingType"));

  const fieldErrors: Partial<Record<ClassMeetingFieldName, true>> = {};
  if (!weekdays) fieldErrors.weekdays = true;
  if (!localStartTime.success) fieldErrors.localStartTime = true;
  if (!localEndTime.success) fieldErrors.localEndTime = true;
  if (!location.success) fieldErrors.location = true;
  if (!meetingType.success) fieldErrors.meetingType = true;

  if (localStartTime.success && localEndTime.success) {
    if (localEndTime.data <= localStartTime.data) fieldErrors.localEndTime = true;
  }

  if (
    !termId.success ||
    !userCourseId.success ||
    !weekdays ||
    !localStartTime.success ||
    !localEndTime.success ||
    !location.success ||
    !meetingType.success ||
    fieldErrors.localEndTime === true
  ) {
    return { status: "error", code: "VALIDATION_ERROR", fieldErrors };
  }

  const lookup = await currentAccountOrError();
  if ("error" in lookup) return lookup.error;

  const termLookup = await requireOwnedTerm(lookup.account.id, termId.data);
  if ("error" in termLookup) return termLookup.error;

  try {
    await createScheduleService().createMeeting(lookup.account.id, userCourseId.data, {
      weekdays,
      localStartTime: localStartTime.data,
      localEndTime: localEndTime.data,
      startsOn: termLookup.term.startsOn,
      endsOn: termLookup.term.endsOn,
      timeZone: termLookup.term.timeZone,
      location: location.data.length > 0 ? location.data : null,
      meetingType: meetingType.data,
    });
  } catch (error) {
    return toActionError(error);
  }

  return { status: "success" };
}

export async function editClassMeetingAction(
  _state: ClassMeetingActionState,
  formData: FormData,
): Promise<ClassMeetingActionState> {
  const id = idSchema.safeParse(fieldValue(formData, "id"));
  const weekdays = parseWeekdays(formData);
  const localStartTime = localTimeSchema.safeParse(
    fieldValue(formData, "localStartTime"),
  );
  const localEndTime = localTimeSchema.safeParse(fieldValue(formData, "localEndTime"));
  const location = locationSchema.safeParse(fieldValue(formData, "location"));
  const meetingType = meetingTypeSchema.safeParse(fieldValue(formData, "meetingType"));

  const fieldErrors: Partial<Record<ClassMeetingFieldName, true>> = {};
  if (!weekdays) fieldErrors.weekdays = true;
  if (!localStartTime.success) fieldErrors.localStartTime = true;
  if (!localEndTime.success) fieldErrors.localEndTime = true;
  if (!location.success) fieldErrors.location = true;
  if (!meetingType.success) fieldErrors.meetingType = true;

  if (localStartTime.success && localEndTime.success) {
    if (localEndTime.data <= localStartTime.data) fieldErrors.localEndTime = true;
  }

  if (
    !id.success ||
    !weekdays ||
    !localStartTime.success ||
    !localEndTime.success ||
    !location.success ||
    !meetingType.success ||
    fieldErrors.localEndTime === true
  ) {
    return { status: "error", code: "VALIDATION_ERROR", fieldErrors };
  }

  const lookup = await currentAccountOrError();
  if ("error" in lookup) return lookup.error;

  try {
    await createScheduleService().editMeeting(lookup.account.id, id.data, {
      weekdays,
      localStartTime: localStartTime.data,
      localEndTime: localEndTime.data,
      location: location.data.length > 0 ? location.data : null,
      meetingType: meetingType.data,
    });
  } catch (error) {
    return toActionError(error);
  }

  return { status: "success" };
}

export async function archiveClassMeetingAction(
  _state: ClassMeetingActionState,
  formData: FormData,
): Promise<ClassMeetingActionState> {
  const id = idSchema.safeParse(fieldValue(formData, "id"));
  if (!id.success) return { status: "error", code: "VALIDATION_ERROR" };

  const lookup = await currentAccountOrError();
  if ("error" in lookup) return lookup.error;

  try {
    await createScheduleService().archiveMeeting(lookup.account.id, id.data);
  } catch (error) {
    return toActionError(error);
  }

  return { status: "success" };
}
