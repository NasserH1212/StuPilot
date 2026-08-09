"use client";

import { useActionState } from "react";

import { getDictionary } from "@/src/shared/localization/dictionaries";
import type { Locale } from "@/src/shared/localization/locales";

import { initialAuthActionState, signOutAction } from "../transport/auth-actions";

export function SignOutButton({ locale }: { readonly locale: Locale }) {
  const dictionary = getDictionary(locale);
  const [state, action, pending] = useActionState(
    signOutAction,
    initialAuthActionState,
  );

  return (
    <form action={action} className="signOutForm">
      <input name="locale" type="hidden" value={locale} />
      <button className="secondaryAction" type="submit" disabled={pending}>
        {pending
          ? dictionary.auth.common.submitting
          : dictionary.auth.workspace.signOut}
      </button>
      <span className="authMessage" role="status" aria-live="polite">
        {state.status === "error" ? dictionary.auth.common.providerUnavailable : null}
      </span>
    </form>
  );
}
