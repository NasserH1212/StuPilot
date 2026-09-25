import { render } from "@testing-library/react";
import axe from "axe-core";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/src/modules/terms/transport/term-actions", () => ({
  initialTermActionState: { status: "idle" },
  createTermAction: async () => ({ status: "idle" }),
  editTermAction: async () => ({ status: "idle" }),
  archiveTermAction: async () => ({ status: "idle" }),
  activateTermAction: async () => ({ status: "idle" }),
}));

import type { TermRecord } from "@/src/modules/terms/application/ports/term-repository";
import { TermsView } from "@/src/modules/terms/presentation/terms-view";
import type { UniversityTermRecord } from "@/src/modules/universities/application/ports/university-term-repository";

const activeTerm: TermRecord = {
  id: "018f57b5-f220-7d84-bafd-4d975e550100",
  userId: "018f57b5-f220-7d84-bafd-4d975e550001",
  name: "Fall 2026",
  startsOn: new Date("2026-09-01T00:00:00.000Z"),
  endsOn: new Date("2026-12-31T00:00:00.000Z"),
  timeZone: "Asia/Riyadh",
  isActive: true,
  archivedAt: null,
  version: 0,
  createdAt: new Date("2026-08-01T00:00:00.000Z"),
  updatedAt: new Date("2026-08-01T00:00:00.000Z"),
};

const inactiveTerm: TermRecord = {
  ...activeTerm,
  id: "018f57b5-f220-7d84-bafd-4d975e550101",
  name: "Spring 2027",
  isActive: false,
};

const archivedTerm: TermRecord = {
  ...activeTerm,
  id: "018f57b5-f220-7d84-bafd-4d975e550102",
  name: "Summer 2025",
  isActive: false,
  archivedAt: new Date("2026-01-01T00:00:00.000Z"),
};

const publishedTerm: UniversityTermRecord = {
  id: "018f57b5-f220-7d84-bafd-4d975e550301",
  universityId: "018f57b5-f220-7d84-bafd-4d975e550101",
  academicYear: 1448,
  term: "first",
  startsOn: new Date("2026-09-01T00:00:00.000Z"),
  endsOn: new Date("2026-12-15T00:00:00.000Z"),
};

describe("academic term accessibility", () => {
  it.each([
    {
      name: "Arabic empty state",
      locale: "ar",
      terms: [] as TermRecord[],
      publishedTerms: [] as UniversityTermRecord[],
    },
    {
      name: "English populated list",
      locale: "en",
      terms: [activeTerm],
      publishedTerms: [],
    },
    {
      name: "English inactive term with actions",
      locale: "en",
      terms: [inactiveTerm],
      publishedTerms: [],
    },
    {
      name: "English archived term",
      locale: "en",
      terms: [archivedTerm],
      publishedTerms: [],
    },
    {
      name: "English create form with a published-term picker",
      locale: "en",
      terms: [] as TermRecord[],
      publishedTerms: [publishedTerm],
    },
  ] as const)(
    "has no structural axe violations in the $name",
    async ({ locale, terms, publishedTerms }) => {
      const { container } = render(
        <TermsView locale={locale} terms={terms} publishedTerms={publishedTerms} />,
      );
      const result = await axe.run(container, {
        rules: { "color-contrast": { enabled: false } },
      });
      expect(result.violations).toEqual([]);
    },
  );
});
