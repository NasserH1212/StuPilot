"use client";

import { useActionState, useRef, useState } from "react";

import type { UniversityTermRecord } from "@/src/modules/universities/application/ports/university-term-repository";
import type { Locale } from "@/src/shared/localization/locales";

import { createTermAction } from "../transport/term-actions";
import { initialTermActionState } from "../transport/term-action-state";
import {
  getTermsDictionary,
  publishedTermOptionLabel,
  termActionMessage,
} from "./terms-dictionary";

const manualDatesChoice = "manual";

function toDateInputValue(value: Date): string {
  return value.toISOString().slice(0, 10);
}

export function TermCreateForm({
  locale,
  publishedTerms = [],
}: {
  readonly locale: Locale;
  readonly publishedTerms?: readonly UniversityTermRecord[];
}) {
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
  const [publishedChoice, setPublishedChoice] = useState("");
  const startRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLInputElement>(null);
  const selectedPublishedTerm = publishedTerms.find(
    (term) => term.id === publishedChoice,
  );
  const startReadOnly = Boolean(selectedPublishedTerm);
  // The university's end date may not be published yet (endsOn is then
  // null); a student's own term still requires one, so it stays editable.
  const endReadOnly = Boolean(selectedPublishedTerm?.endsOn);

  function choosePublishedTerm(term: UniversityTermRecord): void {
    setPublishedChoice(term.id);
    if (startRef.current) startRef.current.value = toDateInputValue(term.startsOn);
    if (endRef.current)
      endRef.current.value = term.endsOn ? toDateInputValue(term.endsOn) : "";
  }

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

        {publishedTerms.length > 0 ? (
          <fieldset className="fieldGroup universityFieldset">
            <legend>{dictionary.publishedTermsLegend}</legend>
            {publishedTerms.map((term) => (
              <label
                className="universityOption"
                key={term.id}
                htmlFor={`term-published-${term.id}`}
              >
                <input
                  id={`term-published-${term.id}`}
                  name="publishedTermChoice"
                  type="radio"
                  value={term.id}
                  checked={publishedChoice === term.id}
                  onChange={() => choosePublishedTerm(term)}
                />
                <span>{publishedTermOptionLabel(dictionary, term)}</span>
              </label>
            ))}
            <label className="universityOption" htmlFor="term-published-manual">
              <input
                id="term-published-manual"
                name="publishedTermChoice"
                type="radio"
                value={manualDatesChoice}
                checked={publishedChoice === manualDatesChoice}
                onChange={() => setPublishedChoice(manualDatesChoice)}
              />
              <span>{dictionary.publishedTermManualOption}</span>
            </label>
          </fieldset>
        ) : null}

        <div className="fieldGroup">
          <label htmlFor="term-start">{dictionary.startLabel}</label>
          <input
            id="term-start"
            name="startsOn"
            type="date"
            dir="ltr"
            required
            ref={startRef}
            readOnly={startReadOnly}
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
            ref={endRef}
            readOnly={endReadOnly}
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
