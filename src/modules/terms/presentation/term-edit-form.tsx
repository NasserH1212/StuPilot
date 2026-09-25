"use client";

import { useActionState, useEffect } from "react";

import type { TermRecord } from "@/src/modules/terms/application/ports/term-repository";
import type { Locale } from "@/src/shared/localization/locales";

import { editTermAction, initialTermActionState } from "../transport/term-actions";
import { getTermsDictionary, termActionMessage } from "./terms-dictionary";

function toDateInputValue(value: Date): string {
  return value.toISOString().slice(0, 10);
}

export function TermEditForm({
  locale,
  term,
  onCancel,
  onSaved,
}: {
  readonly locale: Locale;
  readonly term: TermRecord;
  readonly onCancel: () => void;
  readonly onSaved: () => void;
}) {
  const dictionary = getTermsDictionary(locale);
  const [state, formAction, pending] = useActionState(
    editTermAction,
    initialTermActionState,
  );

  useEffect(() => {
    if (state.status === "success") onSaved();
  }, [state.status, onSaved]);

  const fieldErrors = state.fieldErrors ?? {};
  const actionMessage =
    state.status === "error" ? termActionMessage(dictionary, state.code) : null;

  return (
    <section className="authCard" aria-labelledby={`term-edit-heading-${term.id}`}>
      <h3 id={`term-edit-heading-${term.id}`}>{dictionary.editHeading}</h3>
      <form action={formAction} className="authForm" noValidate>
        <input name="locale" type="hidden" value={locale} />
        <input name="id" type="hidden" value={term.id} />

        <div className="fieldGroup">
          <label htmlFor={`term-edit-name-${term.id}`}>{dictionary.nameLabel}</label>
          <input
            id={`term-edit-name-${term.id}`}
            name="name"
            type="text"
            required
            maxLength={120}
            defaultValue={term.name}
            aria-invalid={fieldErrors.name ? true : undefined}
            aria-describedby={
              fieldErrors.name ? `term-edit-name-error-${term.id}` : undefined
            }
          />
          {fieldErrors.name ? (
            <p className="fieldError" id={`term-edit-name-error-${term.id}`}>
              {dictionary.errors.nameRequired}
            </p>
          ) : null}
        </div>

        <div className="fieldGroup">
          <label htmlFor={`term-edit-start-${term.id}`}>{dictionary.startLabel}</label>
          <input
            id={`term-edit-start-${term.id}`}
            name="startsOn"
            type="date"
            dir="ltr"
            required
            defaultValue={toDateInputValue(term.startsOn)}
            aria-invalid={fieldErrors.startsOn ? true : undefined}
            aria-describedby={
              fieldErrors.startsOn ? `term-edit-start-error-${term.id}` : undefined
            }
          />
          {fieldErrors.startsOn ? (
            <p className="fieldError" id={`term-edit-start-error-${term.id}`}>
              {dictionary.errors.dateRequired}
            </p>
          ) : null}
        </div>

        <div className="fieldGroup">
          <label htmlFor={`term-edit-end-${term.id}`}>{dictionary.endLabel}</label>
          <input
            id={`term-edit-end-${term.id}`}
            name="endsOn"
            type="date"
            dir="ltr"
            required
            defaultValue={toDateInputValue(term.endsOn)}
            aria-invalid={fieldErrors.endsOn ? true : undefined}
            aria-describedby={
              fieldErrors.endsOn ? `term-edit-end-error-${term.id}` : undefined
            }
          />
          {fieldErrors.endsOn ? (
            <p className="fieldError" id={`term-edit-end-error-${term.id}`}>
              {dictionary.errors.dateOrder}
            </p>
          ) : null}
        </div>

        <div className="fieldGroup">
          <label htmlFor={`term-edit-timezone-${term.id}`}>
            {dictionary.timeZoneLabel}
          </label>
          <input
            id={`term-edit-timezone-${term.id}`}
            name="timeZone"
            type="text"
            dir="ltr"
            required
            maxLength={64}
            defaultValue={term.timeZone}
            aria-invalid={fieldErrors.timeZone ? true : undefined}
            aria-describedby={
              fieldErrors.timeZone ? `term-edit-timezone-error-${term.id}` : undefined
            }
          />
          {fieldErrors.timeZone ? (
            <p className="fieldError" id={`term-edit-timezone-error-${term.id}`}>
              {dictionary.errors.timeZoneRequired}
            </p>
          ) : null}
        </div>

        <div className="authMessage" role="status" aria-live="polite">
          {actionMessage}
        </div>

        <div className="termActions">
          <button className="primaryAction" type="submit" disabled={pending}>
            {pending ? dictionary.editSubmitting : dictionary.editSubmit}
          </button>
          <button
            type="button"
            className="secondaryAction"
            onClick={onCancel}
            disabled={pending}
          >
            {dictionary.editCancel}
          </button>
        </div>
      </form>
    </section>
  );
}
