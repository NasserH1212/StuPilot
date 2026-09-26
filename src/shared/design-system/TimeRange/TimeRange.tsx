import styles from "./TimeRange.module.css";

export interface TimeOfDay {
  /** 24-hour clock, 0-23. */
  readonly hour: number;
  readonly minute: number;
}

export interface TimeRangeProps {
  readonly start: TimeOfDay;
  readonly end: TimeOfDay;
  readonly className?: string;
}

function formatClock({ hour, minute }: TimeOfDay): string {
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour12}:${String(minute).padStart(2, "0")}`;
}

function periodLabel({ hour }: TimeOfDay): "ص" | "م" {
  return hour < 12 ? "ص" : "م";
}

/**
 * Developer spec (Figma "Time range • ordered start to end" / "RTL developer
 * spec"): render each range as ONE logical string inside a `dir="rtl"`
 * element and let the browser's bidi algorithm place the start time on the
 * right — never split it into a left-to-right flex row. Same-period ranges
 * label ص/م once, after the end time; ranges that cross noon label both.
 */
export function TimeRange({ start, end, className }: TimeRangeProps) {
  const startLabel = formatClock(start);
  const endLabel = formatClock(end);
  const startPeriod = periodLabel(start);
  const endPeriod = periodLabel(end);

  const text =
    startPeriod === endPeriod
      ? `${startLabel} – ${endLabel} ${endPeriod}`
      : `${startLabel} ${startPeriod} – ${endLabel} ${endPeriod}`;

  return (
    <span className={[styles.range, className].filter(Boolean).join(" ")} dir="rtl">
      {text}
    </span>
  );
}
