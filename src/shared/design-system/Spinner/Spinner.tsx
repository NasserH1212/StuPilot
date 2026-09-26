import { IconSpinnerArc } from "../icons/icons";
import styles from "./Spinner.module.css";

/**
 * Motion: thin blue arc rotates 360° in 800ms linear, only while a button is
 * loading. Reduced motion: static arc. Adapted from "light-rat" by
 * barisdogansutcu on Uiverse.io — see THIRD_PARTY_NOTICES.md.
 */
export function Spinner({ className }: { readonly className?: string }) {
  return (
    <span
      className={[styles.spinner, className].filter(Boolean).join(" ")}
      role="presentation"
    >
      <IconSpinnerArc />
    </span>
  );
}
