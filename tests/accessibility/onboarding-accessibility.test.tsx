import { render } from "@testing-library/react";
import axe from "axe-core";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/src/modules/onboarding/transport/onboarding-actions", () => ({
  initialOnboardingActionState: { status: "idle" },
  completeOnboardingAction: async () => ({ status: "idle" }),
}));

import type { UniversityRecord } from "@/src/modules/universities/application/ports/university-repository";
import { OnboardingForm } from "@/src/modules/onboarding/presentation/onboarding-form";

const universities: readonly UniversityRecord[] = [
  {
    id: "018f57b5-f220-7d84-bafd-4d975e550101",
    nameAr: "جامعة الملك سعود",
    nameEn: "King Saud University",
    shortName: "KSU",
    logoPath: null,
    active: true,
  },
];

describe("onboarding accessibility", () => {
  it.each([
    { name: "Arabic onboarding form", locale: "ar" },
    { name: "English onboarding form", locale: "en" },
  ] as const)("has no structural axe violations in the $name", async ({ locale }) => {
    const { container } = render(
      <OnboardingForm locale={locale} universities={universities} />,
    );
    const result = await axe.run(container, {
      rules: { "color-contrast": { enabled: false } },
    });
    expect(result.violations).toEqual([]);
  });
});
