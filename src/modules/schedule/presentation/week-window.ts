const millisPerDay = 86_400_000;
const daysInWeekStrip = 5; // Sunday..Thursday

export interface WeekWindow {
  /** Sunday of the displayed week, UTC-midnight representing a local calendar date. */
  readonly startsOn: Date;
  /** Thursday of the displayed week (inclusive). */
  readonly endsOn: Date;
}

function addUtcDays(date: Date, days: number): Date {
  const next = new Date(date.getTime());
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

/** The Sunday on or before `date` — the term's day strip always starts on Sunday. */
function sundayOnOrBefore(date: Date): Date {
  return addUtcDays(date, -date.getUTCDay());
}

/** How many Sunday-anchored weeks the term spans, for "week N of {total}". */
export function totalWeeksInTerm(term: {
  readonly startsOn: Date;
  readonly endsOn: Date;
}): number {
  const firstSunday = sundayOnOrBefore(term.startsOn);
  const diffDays = Math.floor(
    (term.endsOn.getTime() - firstSunday.getTime()) / millisPerDay,
  );
  return Math.max(1, Math.ceil((diffDays + 1) / 7));
}

/** 1-based index of the Sunday-anchored week containing `date`, clamped to the term's range. */
export function weekIndexForDate(
  term: { readonly startsOn: Date; readonly endsOn: Date },
  date: Date,
): number {
  const firstSunday = sundayOnOrBefore(term.startsOn);
  const diffDays = Math.floor((date.getTime() - firstSunday.getTime()) / millisPerDay);
  const index = Math.floor(diffDays / 7) + 1;
  return Math.min(Math.max(index, 1), totalWeeksInTerm(term));
}

/** The Sunday–Thursday window for the given 1-based week index. */
export function weekWindowForIndex(
  term: { readonly startsOn: Date },
  weekIndex: number,
): WeekWindow {
  const firstSunday = sundayOnOrBefore(term.startsOn);
  const startsOn = addUtcDays(firstSunday, (weekIndex - 1) * 7);
  const endsOn = addUtcDays(startsOn, daysInWeekStrip - 1);
  return { startsOn, endsOn };
}

export function toLocalDateLabel(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** Today's calendar date (YYYY-MM-DD) as observed in `timeZone`, for "which day is today". */
export function todayLocalDateLabel(timeZone: string): string {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return formatter.format(new Date());
}
