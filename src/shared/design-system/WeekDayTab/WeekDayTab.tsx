import styles from "./WeekDayTab.module.css";

export interface WeekDayTabProps {
  readonly dayLabel: string;
  readonly dateLabel: string;
  readonly isToday: boolean;
  readonly selected: boolean;
  readonly hasDeadline: boolean;
  readonly onSelect: () => void;
  readonly className?: string;
}

/**
 * Motion: 120ms selected-surface transition (handled in CSS). Today gets a
 * blue outline when some other day is selected; the selected day itself is
 * always a full blue fill. The dot marks a task or exam due that day.
 */
export function WeekDayTab({
  dayLabel,
  dateLabel,
  isToday,
  selected,
  hasDeadline,
  onSelect,
  className,
}: WeekDayTabProps) {
  return (
    <button
      type="button"
      className={[styles.tab, className].filter(Boolean).join(" ")}
      aria-current={isToday ? "date" : undefined}
      aria-pressed={selected}
      data-selected={selected}
      onClick={onSelect}
    >
      <span className={styles.day} dir="auto">
        {dayLabel}
      </span>
      <span className={styles.date}>{dateLabel}</span>
      <span className={styles.dot} data-visible={hasDeadline} aria-hidden="true" />
    </button>
  );
}
