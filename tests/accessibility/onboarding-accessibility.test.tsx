import { render } from "@testing-library/react";
import axe from "axe-core";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/src/modules/onboarding/transport/onboarding-actions", () => ({
  initialOnboardingActionState: { status: "idle" },
  completeOnboardingAction: async () => ({ status: "idle" }),
}));

import { OnboardingForm } from "@/src/modules/onboarding/presentation/onboarding-form";

describe("onboarding accessibility", () => {
  it.each([
    { name: "Arabic onboarding form", locale: "ar" },
    { name: "English onboarding form", locale: "en" },
  ] as const)("has no structural axe violations in the $name", async ({ locale }) => {
    const { container } = render(<OnboardingForm locale={locale} />);
    const result = await axe.run(container, {
      rules: { "color-contrast": { enabled: false } },
    });
    expect(result.violations).toEqual([]);
  });
});
