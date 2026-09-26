import styles from "./UniversityMonogram.module.css";

export interface UniversityMonogramProps {
  readonly shortName: string;
  readonly logoPath?: string | null | undefined;
  readonly className?: string;
}

export function UniversityMonogram({
  shortName,
  logoPath,
  className,
}: UniversityMonogramProps) {
  if (logoPath) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- logos are local files of unknown, owner-supplied dimensions.
      <img
        className={[styles.logo, className].filter(Boolean).join(" ")}
        src={`/${logoPath}`}
        alt=""
      />
    );
  }

  return (
    <span
      className={[styles.monogram, className].filter(Boolean).join(" ")}
      aria-hidden="true"
    >
      {shortName}
    </span>
  );
}
