import type { ButtonHTMLAttributes } from "react";

import styles from "./Switch.module.css";

export interface SwitchProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "onChange" | "type"
> {
  readonly checked: boolean;
  readonly onChange: (checked: boolean) => void;
  readonly label: string;
}

/**
 * Motion: 180ms ease-out thumb travel; on position is toward the reading end
 * (left in RTL) and the track becomes accent-colored. Reduced motion: instant
 * position change. Adapted from "green-liger" by gharsh11032000 on
 * Uiverse.io — see THIRD_PARTY_NOTICES.md.
 */
export function Switch({
  checked,
  onChange,
  label,
  className,
  disabled,
  ...rest
}: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      className={[styles.control, className].filter(Boolean).join(" ")}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      {...rest}
    >
      <span className={styles.track}>
        <span className={styles.thumb} />
      </span>
    </button>
  );
}
