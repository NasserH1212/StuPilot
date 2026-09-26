import type { ReactNode } from "react";

import { IconKaabaBreak, IconLeafBreak, IconMoonBreak } from "../icons/icons";
import styles from "./AlertBanner.module.css";

export type AlertBannerKind =
  "info" | "success" | "warning" | "danger" | "fall" | "fitr" | "adha";

export interface AlertBannerProps {
  readonly kind: AlertBannerKind;
  readonly title: string;
  readonly body: string;
  readonly className?: string;
}

const breakIcon: Partial<Record<AlertBannerKind, ReactNode>> = {
  fall: <IconLeafBreak className={styles.icon} />,
  fitr: <IconMoonBreak className={styles.icon} />,
  adha: <IconKaabaBreak className={styles.icon} />,
};

const toneClass: Record<AlertBannerKind, string | undefined> = {
  info: styles.info,
  success: styles.success,
  warning: styles.warning,
  danger: styles.danger,
  fall: styles.break,
  fitr: styles.break,
  adha: styles.break,
};

export function AlertBanner({ kind, title, body, className }: AlertBannerProps) {
  const icon = breakIcon[kind];

  return (
    <div
      className={[styles.banner, toneClass[kind], className].filter(Boolean).join(" ")}
      role={kind === "danger" ? "alert" : "status"}
    >
      <div className={styles.body}>
        <p className={styles.title} dir="auto">
          {title}
        </p>
        <p className={styles.message} dir="auto">
          {body}
        </p>
      </div>
      {icon}
    </div>
  );
}
