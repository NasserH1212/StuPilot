import type { ButtonHTMLAttributes } from "react";

import styles from "./Chip.module.css";

export interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  readonly label: string;
  readonly selected?: boolean;
}

export function Chip({ label, selected = false, className, ...rest }: ChipProps) {
  return (
    <button
      type="button"
      className={[styles.chip, className].filter(Boolean).join(" ")}
      aria-pressed={selected}
      {...rest}
    >
      <span dir="auto">{selected ? `✓ ${label}` : label}</span>
    </button>
  );
}
