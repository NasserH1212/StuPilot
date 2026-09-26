import { useId } from "react";
import type { InputHTMLAttributes, Ref } from "react";

import styles from "./Input.module.css";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  readonly label: string;
  readonly help?: string | undefined;
  readonly error?: string | undefined;
  readonly ref?: Ref<HTMLInputElement> | undefined;
}

export function Input({ label, help, error, className, id, ref, ...rest }: InputProps) {
  const generatedId = useId();
  // Falling back to `name` alone isn't unique enough when the same field
  // name (e.g. "name") can render in more than one form on the same page
  // (a create form alongside an open edit form) — an explicit `id` or the
  // generated one avoids colliding label/input associations.
  const resolvedId = id ?? (rest.name ? `${rest.name}-${generatedId}` : generatedId);
  const helpId = help || error ? `${resolvedId}-help` : undefined;

  return (
    <div className={[styles.field, className].filter(Boolean).join(" ")}>
      <label className={styles.label} htmlFor={resolvedId} dir="auto">
        {label}
      </label>
      <input
        ref={ref}
        id={resolvedId}
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
