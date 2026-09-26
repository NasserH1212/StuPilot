import type { Weekday } from "../domain/class-meeting";
import type { WeekLectureItem } from "./week-lecture-items";

export interface WeekGridRow {
  readonly timeLabel: string;
  readonly cellsByWeekday: ReadonlyMap<Weekday, WeekLectureItem>;
}

function timeLabel({
  hour,
  minute,
}: {
  readonly hour: number;
  readonly minute: number;
}): string {
  return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
}

/**
 * One row per distinct start time actually in use that week (not a fixed
 * hourly scale), each holding whichever weekday/item lands on it. Figma's
 * grid rows are a fixed mock scale; a real student's schedule has whatever
 * start times their own meetings use.
 */
export function buildWeekGrid(
  items: readonly WeekLectureItem[],
): readonly WeekGridRow[] {
  const rowsByTime = new Map<string, Map<Weekday, WeekLectureItem>>();

  for (const item of items) {
    const label = timeLabel(item.start);
    const row = rowsByTime.get(label) ?? new Map<Weekday, WeekLectureItem>();
    row.set(item.weekday, item);
    rowsByTime.set(label, row);
  }

  return [...rowsByTime.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([timeLabelValue, cellsByWeekday]) => ({
      timeLabel: timeLabelValue,
      cellsByWeekday,
    }));
}
