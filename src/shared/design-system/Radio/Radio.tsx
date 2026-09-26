import type { InputHTMLAttributes } from "react";

import { IconRadioIndicator } from "../icons/icons";
import styles from "./Radio.module.css";

export interface RadioProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  readonly label: string;
}

export function Radio({ label, className, checked = false, ...rest }: RadioProps) {
  return (
    <label className={[styles.option, className].filter(Boolean).join(" ")}>
      <input type="radio" className={styles.nativeInput} checked={checked} {...rest} />
      <span className={styles.label} dir="auto">
        {label}
      </span>
      <IconRadioIndicator className={styles.indicator} selected={checked} />
    </label>
  );
}
