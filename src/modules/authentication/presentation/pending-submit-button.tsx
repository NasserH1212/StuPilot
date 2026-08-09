"use client";

import { useFormStatus } from "react-dom";

export function PendingSubmitButton({
  pendingLabel,
  submitLabel,
}: {
  readonly pendingLabel: string;
  readonly submitLabel: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button className="primaryAction" type="submit" disabled={pending}>
      {pending ? pendingLabel : submitLabel}
    </button>
  );
}
