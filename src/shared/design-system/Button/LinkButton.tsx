import Link from "next/link";
import type { Route } from "next";
import type { ReactNode } from "react";

import styles from "./Button.module.css";

export interface LinkButtonProps {
  readonly href: Route;
  readonly variant?: "primary" | "secondary";
  readonly fullWidth?: boolean;
  readonly className?: string;
  readonly children: ReactNode;
}

/** A navigational counterpart to Button — same visual styles, renders an anchor. */
export function LinkButton({
  href,
  variant = "primary",
  fullWidth = false,
  className,
  children,
}: LinkButtonProps) {
  const variantClass = variant === "primary" ? styles.primary : styles.secondary;
  const classes = [
    styles.button,
    variantClass,
    fullWidth ? styles.fullWidth : null,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Link href={href} className={classes}>
      <span dir="auto">{children}</span>
    </Link>
  );
}
