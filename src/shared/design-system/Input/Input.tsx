import { useId } from "react";
import type { InputHTMLAttributes } from "react";

import styles from "./Input.module.css";

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "id"> {
  readonly label: string;
  readonly help?: string;
  readonly error?: string;
}

export function Input({ label, help, error, className, ...rest }: InputProps) {
  const generatedId = useId();
  const id = rest.name ?? generatedId;
  const helpId = help || error ? `${id}-help` : undefined;

  return (
    <div className={[styles.field, className].filter(Boolean).join(" ")}>
      <label className={styles.label} htmlFor={id} dir="auto">
        {label}
      </label>
      <input
        id={id}
        className={styles.control}
        dir="auto"
        aria-invalid={Boolean(error)}
        aria-describedby={helpId}
        {...rest}
      />
      {error ? (
        <p id={helpId} className={`${styles.help} ${styles.error}`} dir="auto">
          {error}
        </p>
      ) : help ? (
        <p id={helpId} className={styles.help} dir="auto">
          {help}
        </p>
      ) : null}
    </div>
  );
}
