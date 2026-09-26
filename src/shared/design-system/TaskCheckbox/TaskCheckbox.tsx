"use client";

import { useState } from "react";

import { IconCheckboxTarget } from "../icons/icons";
import styles from "./TaskCheckbox.module.css";

export interface TaskCheckboxProps {
  readonly title: string;
  readonly checked: boolean;
  readonly onChange: (checked: boolean) => void;
  readonly className?: string;
}

/**
 * Motion: 240ms low-opacity blue ripple within the 44px target, then the
 * check reveals; checked title gets a strikethrough and muted color.
 * Reduced motion: no ripple, instant check and title change. Adapted from
 * "wise-elephant" by MattiaCode-IT on Uiverse.io — see THIRD_PARTY_NOTICES.md.
 */
export function TaskCheckbox({
  title,
  checked,
  onChange,
  className,
}: TaskCheckboxProps) {
  const [rippling, setRippling] = useState(false);

  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      className={[styles.control, className].filter(Boolean).join(" ")}
      onClick={() => {
        const next = !checked;
        onChange(next);
        if (next) setRippling(true);
      }}
    >
      <span className={styles.title} dir="auto">
        {title}
      </span>
      <span className={styles.target}>
        <span
          className={[styles.ripple, rippling ? styles.rippling : null]
            .filter(Boolean)
            .join(" ")}
          onAnimationEnd={() => setRippling(false)}
        />
        <IconCheckboxTarget checked={checked} />
      </span>
    </button>
  );
}
