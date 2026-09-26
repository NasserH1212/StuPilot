"use client";

import { IconClouds, IconMoon, IconSun } from "../icons/icons";
import { useTheme } from "../theme/theme-context";
import styles from "./ThemeSwitch.module.css";

/**
 * Quick light/dark toggle. Original drawing — not adapted from any
 * third-party source. Motion: 220ms crossfade between the sun/clouds and
 * moon/stars faces; the control itself never rotates. Reduced motion:
 * instant symbol swap.
 */
export function ThemeSwitch({ className }: { readonly className?: string }) {
  const { resolvedTheme, setPreference } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label="تبديل المظهر بين الفاتح والداكن"
      className={[styles.control, className].filter(Boolean).join(" ")}
      onClick={() => setPreference(isDark ? "light" : "dark")}
    >
      <span className={`${styles.face} ${styles.light}`}>
        <IconClouds />
        <IconSun />
      </span>
      <span className={`${styles.face} ${styles.dark}`}>
        <span className={styles.starMark} aria-hidden="true">
          {"✦  ·"}
        </span>
        <IconMoon />
      </span>
    </button>
  );
}
