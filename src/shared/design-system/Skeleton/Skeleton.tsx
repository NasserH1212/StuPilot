import styles from "./Skeleton.module.css";

export type SkeletonKind = "card" | "list" | "input";

const barWidths: Record<SkeletonKind, ReadonlyArray<string>> = {
  card: ["91%", "62%", "91%"],
  list: ["91%", "62%", "62%", "91%", "62%"],
  input: ["91%", "62%"],
};

export interface SkeletonProps {
  readonly kind: SkeletonKind;
  readonly className?: string;
}

/**
 * Motion: soft shimmer travels across placeholder bars, 1.4s linear loop;
 * `prefers-reduced-motion` swaps to a static fill. Adapted from
 * "light-husky" by Nawsome on Uiverse.io — see THIRD_PARTY_NOTICES.md.
 */
export function Skeleton({ kind, className }: SkeletonProps) {
  return (
    <div
      className={[styles.skeleton, className].filter(Boolean).join(" ")}
      role="status"
      aria-busy="true"
    >
      <span className={styles.visuallyHidden}>جارٍ التحميل</span>
      {barWidths[kind].map((width, index) => (
        <span
          key={index}
          className={styles.bar}
          style={{ inlineSize: width }}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}
