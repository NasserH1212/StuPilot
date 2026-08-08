import type { ReactNode } from "react";

interface BidiIsolateProps {
  readonly children: ReactNode;
  readonly direction?: "auto" | "ltr" | "rtl";
}

export function BidiIsolate({ children, direction = "auto" }: BidiIsolateProps) {
  return <bdi dir={direction}>{children}</bdi>;
}
