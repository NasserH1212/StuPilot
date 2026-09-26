import styles from "./CountdownBadge.module.css";

export type CountdownTone = "next" | "today" | "soon" | "overdue" | "neutral";

export interface CountdownBadgeProps {
  readonly tone: CountdownTone;
  readonly label: string;
  readonly className?: string;
}

/** Display-only time indicator; the caller must also show the absolute deadline. */
export function CountdownBadge({ tone, label, className }: CountdownBadgeProps) {
  return (
    <span
      className={[styles.badge, styles[tone], className].filter(Boolean).join(" ")}
      dir="auto"
    >
      {label}
    </span>
  );
}
