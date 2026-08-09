import Link from "next/link";
import type { ReactNode } from "react";

import type { LocalizedPath } from "@/src/shared/localization/routing";

interface AuthStateViewProps {
  readonly actionHref: LocalizedPath;
  readonly actionLabel: string;
  readonly body: ReactNode;
  readonly eyebrow: string;
  readonly title: string;
}

export function AuthStateView({
  actionHref,
  actionLabel,
  body,
  eyebrow,
  title,
}: AuthStateViewProps) {
  return (
    <section className="authCard" aria-labelledby="auth-state-heading">
      <p className="eyebrow">{eyebrow}</p>
      <h1 id="auth-state-heading">{title}</h1>
      <p className="supportingCopy">{body}</p>
      <Link className="primaryAction" href={actionHref}>
        {actionLabel}
      </Link>
    </section>
  );
}
