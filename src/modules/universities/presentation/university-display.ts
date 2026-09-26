import type { UniversityRecord } from "@/src/modules/universities/application/ports/university-repository";
import type { Locale } from "@/src/shared/localization/locales";

export interface UniversityDisplay {
  readonly name: string;
  readonly shortName: string;
  readonly logoPath: string | null;
}

function initialsFromName(name: string): string {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join("");
  return initials.length > 0 ? initials.toUpperCase() : "?";
}

/**
 * Resolves the header's university block from an onboarding profile: the
 * matched catalog record when the profile references one (by id), or a
 * derived monogram from the profile's free-text name for manual entries.
 */
export function resolveUniversityDisplay(
  universities: readonly UniversityRecord[],
  locale: Locale,
  universityId: string | null,
  fallbackName: string | null,
): UniversityDisplay | null {
  const matched = universityId
    ? universities.find((university) => university.id === universityId)
    : undefined;

  if (matched) {
    return {
      name: locale === "ar" ? matched.nameAr : matched.nameEn,
      shortName: matched.shortName,
      logoPath: matched.logoPath,
    };
  }

  if (fallbackName && fallbackName.trim().length > 0) {
    return {
      name: fallbackName,
      shortName: initialsFromName(fallbackName),
      logoPath: null,
    };
  }

  return null;
}
