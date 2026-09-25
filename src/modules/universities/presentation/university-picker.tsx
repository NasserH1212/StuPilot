"use client";

import { useId, useMemo, useState } from "react";

import type { UniversityRecord } from "@/src/modules/universities/application/ports/university-repository";
import type { Locale } from "@/src/shared/localization/locales";

import { UniversityBadge } from "./university-badge";

export const universityNotListedValue = "not-listed";

export interface UniversityPickerDictionary {
  readonly searchLabel: string;
  readonly searchPlaceholder: string;
  readonly legend: string;
  readonly notListedLabel: string;
  readonly freeTextLabel: string;
  readonly noResults: string;
}

export function UniversityPicker({
  locale,
  universities,
  dictionary,
  freeTextError,
}: {
  readonly locale: Locale;
  readonly universities: readonly UniversityRecord[];
  readonly dictionary: UniversityPickerDictionary;
  readonly freeTextError?: string | null;
}) {
  const searchId = useId();
  const [query, setQuery] = useState("");
  const [choice, setChoice] = useState("");

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (needle.length === 0) return universities;
    return universities.filter((university) =>
      [university.nameAr, university.nameEn, university.shortName].some((value) =>
        value.toLowerCase().includes(needle),
      ),
    );
  }, [query, universities]);

  return (
    <div className="fieldGroup">
      <label htmlFor={searchId}>{dictionary.searchLabel}</label>
      <input
        id={searchId}
        type="text"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={dictionary.searchPlaceholder}
      />

      <fieldset className="fieldGroup universityFieldset">
        <legend>{dictionary.legend}</legend>
        <div className="universityList">
          {filtered.map((university) => (
            <label
              className="universityOption"
              key={university.id}
              htmlFor={`university-${university.id}`}
            >
              <input
                id={`university-${university.id}`}
                name="universityChoice"
                type="radio"
                value={university.id}
                checked={choice === university.id}
                onChange={() => setChoice(university.id)}
              />
              <UniversityBadge university={university} />
              <span>{locale === "ar" ? university.nameAr : university.nameEn}</span>
            </label>
          ))}
          {filtered.length === 0 ? (
            <p className="fieldHelp">{dictionary.noResults}</p>
          ) : null}
        </div>

        <label className="universityOption" htmlFor="university-not-listed">
          <input
            id="university-not-listed"
            name="universityChoice"
            type="radio"
            value={universityNotListedValue}
            checked={choice === universityNotListedValue}
            onChange={() => setChoice(universityNotListedValue)}
          />
          <span>{dictionary.notListedLabel}</span>
        </label>
      </fieldset>

      {choice === universityNotListedValue ? (
        <div className="fieldGroup">
          <label htmlFor="university-free-text">{dictionary.freeTextLabel}</label>
          <input
            id="university-free-text"
            name="universityFreeText"
            type="text"
            maxLength={120}
            aria-invalid={freeTextError ? true : undefined}
            aria-describedby={freeTextError ? "university-free-text-error" : undefined}
          />
          {freeTextError ? (
            <p className="fieldError" id="university-free-text-error">
              {freeTextError}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
