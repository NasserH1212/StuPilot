import { Button } from "../Button/Button";
import styles from "./EmptyState.module.css";

export interface EmptyStateProps {
  readonly title: string;
  readonly description: string;
  readonly actionLabel: string;
  readonly onAction: () => void;
  readonly className?: string;
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div className={[styles.state, className].filter(Boolean).join(" ")}>
      <span className={styles.glyph} aria-hidden="true">
        {"＋"}
      </span>
      <p className={styles.title} dir="auto">
        {title}
      </p>
      <p className={styles.description} dir="auto">
        {description}
      </p>
      <Button variant="primary" onClick={onAction}>
        {actionLabel}
      </Button>
    </div>
  );
}
