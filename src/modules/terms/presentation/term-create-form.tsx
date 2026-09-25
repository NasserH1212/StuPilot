"use client";

import { useActionState, useState } from "react";

import type { Locale } from "@/src/shared/localization/locales";

import { createTermAction, initialTermActionState } from "../transport/term-actions";
import { getTermsDictionary, termActionMessage } from "./terms-dictionary";

export function TermCreateForm({ locale }: { readonly locale: Locale }) {
  const dictionary = getTermsDictionary(locale);
  const [state, formAction, pending] = useActionState(
    createTermAction,
    initialTermActionState,
  );
  const [defaultTimeZone] = useState(() => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch {
      return "";
    }
  });

  const fieldErrors = state.fieldErrors ?? {};
  const actionMessage =
    state.status === "error" ? termActionMessage(dictionary, state.code) : null;

  return (
    <section className="authCard" aria-labelledby="term-create-heading">
      <h2 id="term-create-heading">{dictionary.createHeading}</h2>
      {state.status === "success" ? (
        <p className="authSuccess" role="status">
          {dictionary.created}
        </p>
      ) : null}
      <form action={formAction} className="authForm" noValidate>
        <input name="locale" type="hidden" value={locale} />

        <div className="fieldGroup">
          <label htmlFor="term-name">{dictionary.nameLabel}</label>
          <input
            id="term-name"
            name="name"
            type="text"
            required
            maxLength={120}
            aria-invalid={fieldErrors.name ? true : undefined}
            aria-describedby={fieldErrors.name ? "term-name-error" : undefined}
          />
          {fieldErrors.name ? (
            <p className="fieldError" id="term-name-error">
              {dictionary.errors.nameRequired}
            </p>
          ) : null}
        </div>

        <div className="fieldGroup">
          <label htmlFor="term-start">{dictionary.startLabel}</label>
          <input
            id="term-start"
            name="startsOn"
            type="date"
            dir="ltr"
            required
            aria-invalid={fieldErrors.startsOn ? true : undefined}
            aria-describedby={fieldErrors.startsOn ? "term-start-error" : undefined}
          />
          {fieldErrors.startsOn ? (
            <p className="fieldError" id="term-start-error">
              {dictionary.errors.dateRequired}
            </p>
          ) : null}
        </div>

        <div className="fieldGroup">
          <label htmlFor="term-end">{dictionary.endLabel}</label>
          <input
            id="term-end"
            name="endsOn"
            type="date"
            dir="ltr"
            required
            aria-invalid={fieldErrors.endsOn ? true : undefined}
            aria-describedby={fieldErrors.endsOn ? "term-end-error" : undefined}
          />
          {fieldErrors.endsOn ? (
            <p className="fieldError" id="term-end-error">
              {dictionary.errors.dateOrder}
            </p>
          ) : null}
        </div>

        <div className="fieldGroup">
          <label htmlFor="term-timezone">{dictionary.timeZoneLabel}</label>
          <input
            id="term-timezone"
            name="timeZone"
            type="text"
            dir="ltr"
            required
            maxLength={64}
            defaultValue={defaultTimeZone}
            aria-invalid={fieldErrors.timeZone ? true : undefined}
            aria-describedby={fieldErrors.timeZone ? "term-timezone-error" : undefined}
          />
          {fieldErrors.timeZone ? (
            <p className="fieldError" id="term-timezone-error">
              {dictionary.errors.timeZoneRequired}
            </p>
          ) : null}
        </div>

        <div className="fieldGroup">
          <label className="checkboxField" htmlFor="term-active">
            <input id="term-active" name="isActive" type="checkbox" />
            <span>{dictionary.activeLabel}</span>
          </label>
        </div>

        <div className="authMessage" role="status" aria-live="polite">
          {actionMessage}
        </div>
        <button className="primaryAction" type="submit" disabled={pending}>
          {pending ? dictionary.submitting : dictionary.submit}
        </button>
      </form>
    </section>
  );
}
