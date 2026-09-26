import Link from "next/link";
import type { Route } from "next";

import { UniversityMonogram } from "../UniversityMonogram/UniversityMonogram";
import styles from "./AppHeader.module.css";

export interface AppHeaderProps {
  readonly brandLabel: string;
  readonly homeHref: Route;
  readonly university?: {
    readonly name: string;
    readonly shortName: string;
    readonly logoPath?: string | null;
  } | null;
  readonly className?: string;
}

/** The "University + brand" row shown at the top of every workspace screen. */
export function AppHeader({
  brandLabel,
  homeHref,
  university,
  className,
}: AppHeaderProps) {
  return (
    <div className={[styles.header, className].filter(Boolean).join(" ")}>
      <Link className={styles.brand} href={homeHref} dir="ltr">
        {brandLabel}
      </Link>
      {university && (
        <div className={styles.university}>
          <span className={styles.universityName} dir="auto">
            {university.name}
          </span>
          <UniversityMonogram
            shortName={university.shortName}
            logoPath={university.logoPath}
          />
        </div>
      )}
    </div>
  );
}
