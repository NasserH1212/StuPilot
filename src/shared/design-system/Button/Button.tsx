import type { ButtonHTMLAttributes, ReactNode } from "react";

import { IconDismissCross, IconForwardArrow } from "../icons/icons";
import { Spinner } from "../Spinner/Spinner";
import styles from "./Button.module.css";

export type ButtonVariant = "primary" | "secondary" | "danger";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  readonly variant?: ButtonVariant;
  readonly loading?: boolean;
  readonly loadingLabel?: ReactNode;
  readonly fullWidth?: boolean;
  readonly onDismiss?: () => void;
}

/**
 * Danger variant is an original drawing (not adapted from Uiverse.io); see the
 * component description in Figma. Motion: 120ms pressed feedback via
 * `:active`, instant under `prefers-reduced-motion` (handled in CSS).
 */
export function Button({
  variant = "primary",
  loading = false,
  loadingLabel,
  fullWidth = false,
  disabled,
  className,
  children,
  ...rest
}: ButtonProps) {
  const variantClass =
    variant === "primary"
      ? styles.primary
      : variant === "secondary"
        ? styles.secondary
        : styles.danger;
  const classes = [
    styles.button,
    variantClass,
    fullWidth ? styles.fullWidth : null,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (variant === "danger") {
    return (
      <button
        type="button"
        className={classes}
        disabled={disabled || loading}
        {...rest}
      >
        <span className={styles.dangerLabel} dir="auto">
          {loading ? (loadingLabel ?? children) : children}
        </span>
        <span className={styles.dangerSegment}>
          {loading ? (
            <span className={styles.loadingBubble}>
              <Spinner />
            </span>
          ) : (
            <IconDismissCross className={styles.icon} />
          )}
        </span>
      </button>
    );
  }

  return (
    <button type="button" className={classes} disabled={disabled || loading} {...rest}>
      <span dir="auto">{loading ? (loadingLabel ?? children) : children}</span>
      {loading ? (
        <span className={styles.loadingBubble}>
          <Spinner />
        </span>
      ) : (
        variant === "primary" && <IconForwardArrow className={styles.icon} />
      )}
    </button>
  );
}
