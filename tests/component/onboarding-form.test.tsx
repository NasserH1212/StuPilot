import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/src/modules/onboarding/transport/onboarding-actions", () => ({
  initialOnboardingActionState: { status: "idle" },
  completeOnboardingAction: async () => ({ status: "idle" }),
}));

import { OnboardingForm } from "@/src/modules/onboarding/presentation/onboarding-form";

describe("onboarding form", () => {
  it("renders the Arabic form with the current locale preselected", () => {
    render(<OnboardingForm locale="ar" />);

    expect(screen.getByRole("heading", { name: "لنجهّز مساحتك" })).toBeInTheDocument();
    expect(screen.getByLabelText("العربية")).toBeChecked();
    expect(screen.getByLabelText("English")).not.toBeChecked();
    expect(
      screen.getByRole("button", { name: "متابعة إلى الفصل الأول" }),
    ).toBeEnabled();
  });

  it("renders the English form with a detected time-zone field", () => {
    render(<OnboardingForm locale="en" />);

    expect(
      screen.getByRole("heading", { name: "Let's set up your workspace" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("English")).toBeChecked();
    expect(screen.getByLabelText("Time zone")).toBeRequired();
  });

  it("renders university and major as optional, unrequired fields", () => {
    render(<OnboardingForm locale="en" />);

    expect(screen.getByLabelText("University (optional)")).not.toBeRequired();
    expect(screen.getByLabelText("Major (optional)")).not.toBeRequired();
  });
});
