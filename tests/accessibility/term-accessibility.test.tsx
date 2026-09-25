import { render } from "@testing-library/react";
import axe from "axe-core";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/src/modules/terms/transport/term-actions", () => ({
  initialTermActionState: { status: "idle" },
  createTermAction: async () => ({ status: "idle" }),
}));

import type { TermRecord } from "@/src/modules/terms/application/ports/term-repository";
import { TermsView } from "@/src/modules/terms/presentation/terms-view";

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

describe("academic term accessibility", () => {
  it.each([
    { name: "Arabic empty state", locale: "ar", terms: [] as TermRecord[] },
    { name: "English populated list", locale: "en", terms: [activeTerm] },
  ] as const)(
    "has no structural axe violations in the $name",
    async ({ locale, terms }) => {
      const { container } = render(<TermsView locale={locale} terms={terms} />);
      const result = await axe.run(container, {
        rules: { "color-contrast": { enabled: false } },
      });
      expect(result.violations).toEqual([]);
    },
  );
});
