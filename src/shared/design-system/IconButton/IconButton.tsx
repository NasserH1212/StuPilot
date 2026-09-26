import Link from "next/link";
import type { Route } from "next";
import type { ButtonHTMLAttributes, ReactNode } from "react";

import styles from "./IconButton.module.css";

interface IconButtonBaseProps {
  readonly icon: ReactNode;
  readonly "aria-label": string;
  readonly className?: string;
}

export type IconButtonProps = IconButtonBaseProps &
  (
    | { readonly href: Route }
    | ({ readonly href?: undefined } & ButtonHTMLAttributes<HTMLButtonElement>)
  );

/** 44×44px icon-only action; an accessible name is required. */
export function IconButton(props: IconButtonProps) {
  const { icon, className } = props;
  const ariaLabel = props["aria-label"];
  const classes = [styles.button, className].filter(Boolean).join(" ");

  if (props.href !== undefined) {
    return (
      <Link href={props.href} className={classes} aria-label={ariaLabel}>
        <span className={styles.icon}>{icon}</span>
      </Link>
    );
  }

  const { onClick, disabled, type } = props;
  return (
    <button
      type={type ?? "button"}
      className={classes}
      aria-label={ariaLabel}
      aria-disabled={disabled}
      disabled={disabled}
      onClick={onClick}
    >
      <span className={styles.icon}>{icon}</span>
    </button>
  );
}
