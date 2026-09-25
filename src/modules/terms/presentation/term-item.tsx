"use client";

import type { Route } from "next";
import Link from "next/link";
import { useActionState, useState } from "react";

import { BidiIsolate } from "@/src/modules/foundation/presentation/bidi-isolate";
import type { TermRecord } from "@/src/modules/terms/application/ports/term-repository";
import type { Locale } from "@/src/shared/localization/locales";

import { activateTermAction, archiveTermAction } from "../transport/term-actions";
import { initialTermActionState } from "../transport/term-action-state";
import { getTermsDictionary, termActionMessage } from "./terms-dictionary";
import { TermEditForm } from "./term-edit-form";

function formatDate(locale: Locale, value: Date): string {
  return new Intl.DateTimeFormat(locale === "ar" ? "ar" : "en", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(value);
}

type Mode = "view" | "editing" | "confirmArchive";

export function TermItem({
  locale,
  term,
}: {
  readonly locale: Locale;
  readonly term: TermRecord;
}) {
  const dictionary = getTermsDictionary(locale);
  const [mode, setMode] = useState<Mode>("view");
  const [archiveState, archiveAction, archivePending] = useActionState(
    archiveTermAction,
    initialTermActionState,
  );
  const [activateState, activateAction, activatePending] = useActionState(
    activateTermAction,
    initialTermActionState,
  );

  if (term.archivedAt) {
    return (
      <li className="termItem">
        <div className="termItemHeader">
          <span className="termName">
            <BidiIsolate>{term.name}</BidiIsolate>
          </span>
          <span className="termBadge">{dictionary.archivedBadge}</span>
        </div>
        <p className="termDates">
          <BidiIsolate direction="ltr">{formatDate(locale, term.startsOn)}</BidiIsolate>
          <span aria-hidden="true"> {dictionary.datesSeparator} </span>
          <BidiIsolate direction="ltr">{formatDate(locale, term.endsOn)}</BidiIsolate>
        </p>
        <Link
          className="secondaryAction"
          href={`/${locale}/workspace/terms/${term.id}/courses` as Route}
        >
          {dictionary.coursesLink}
        </Link>
      </li>
    );
  }

  if (mode === "editing") {
    return (
      <li className="termItem">
        <TermEditForm
          locale={locale}
          term={term}
          onCancel={() => setMode("view")}
          onSaved={() => setMode("view")}
        />
      </li>
    );
  }

  const statusMessage =
    (archiveState.status === "error"
      ? termActionMessage(dictionary, archiveState.code)
      : null) ??
    (activateState.status === "error"
      ? termActionMessage(dictionary, activateState.code)
      : null);

  return (
    <li className="termItem">
      <div className="termItemHeader">
        <span className="termName">
          <BidiIsolate>{term.name}</BidiIsolate>
        </span>
        {term.isActive ? (
          <span className="termBadge termBadgeActive">{dictionary.activeBadge}</span>
        ) : null}
      </div>
      <p className="termDates">
        <BidiIsolate direction="ltr">{formatDate(locale, term.startsOn)}</BidiIsolate>
        <span aria-hidden="true"> {dictionary.datesSeparator} </span>
        <BidiIsolate direction="ltr">{formatDate(locale, term.endsOn)}</BidiIsolate>
      </p>
      <Link
        className="secondaryAction"
        href={`/${locale}/workspace/terms/${term.id}/courses` as Route}
      >
        {dictionary.coursesLink}
      </Link>

      <div className="termActions">
        <button
          type="button"
          className="secondaryAction"
          onClick={() => setMode("editing")}
        >
          {dictionary.editAction}
        </button>

        {term.isActive ? null : (
          <form action={activateAction}>
            <input name="locale" type="hidden" value={locale} />
            <input name="id" type="hidden" value={term.id} />
            <button
              className="secondaryAction"
              type="submit"
              disabled={activatePending}
            >
              {activatePending ? dictionary.activating : dictionary.activateAction}
            </button>
          </form>
        )}

        {mode === "confirmArchive" ? (
          <form action={archiveAction} className="termActions">
            <input name="locale" type="hidden" value={locale} />
            <input name="id" type="hidden" value={term.id} />
            <span role="status">{dictionary.archiveConfirmPrompt}</span>
            <button className="primaryAction" type="submit" disabled={archivePending}>
              {archivePending ? dictionary.archiving : dictionary.archiveConfirm}
            </button>
            <button
              type="button"
              className="secondaryAction"
              onClick={() => setMode("view")}
              disabled={archivePending}
            >
              {dictionary.archiveCancel}
            </button>
          </form>
        ) : (
          <button
            type="button"
            className="secondaryAction"
            onClick={() => setMode("confirmArchive")}
          >
            {dictionary.archiveAction}
          </button>
        )}
      </div>

      <div className="authMessage" role="status" aria-live="polite">
        {statusMessage}
      </div>
    </li>
  );
}
