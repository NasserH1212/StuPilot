import { fireEvent, render, screen } from "@testing-library/react";
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

describe("onboarding form", () => {
  it("renders the Arabic form with the current locale preselected", () => {
    render(<OnboardingForm locale="ar" universities={universities} />);

    expect(screen.getByRole("heading", { name: "لنجهّز مساحتك" })).toBeInTheDocument();
    expect(screen.getByLabelText("العربية")).toBeChecked();
    expect(screen.getByLabelText("English")).not.toBeChecked();
    expect(
      screen.getByRole("button", { name: "متابعة إلى الفصل الأول" }),
    ).toBeEnabled();
  });

  it("renders the English form with a detected time-zone field", () => {
    render(<OnboardingForm locale="en" universities={universities} />);

    expect(
      screen.getByRole("heading", { name: "Let's set up your workspace" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("English")).toBeChecked();
    expect(screen.getByLabelText("Time zone")).toBeRequired();
  });

  it("renders major as an optional, unrequired field", () => {
    render(<OnboardingForm locale="en" universities={universities} />);

    expect(screen.getByLabelText("Major (optional)")).not.toBeRequired();
  });

  it("lists catalog universities and shows free text only when not listed", () => {
    render(<OnboardingForm locale="en" universities={universities} />);

    expect(screen.getByLabelText(/King Saud University/)).toBeInTheDocument();
    expect(screen.queryByLabelText("University name")).not.toBeInTheDocument();

    fireEvent.click(screen.getByLabelText("My university isn't listed"));

    expect(screen.getByLabelText("University name")).toBeInTheDocument();
  });

  it("filters the university list by search text", () => {
    render(<OnboardingForm locale="en" universities={universities} />);

    fireEvent.change(screen.getByLabelText("Search for your university"), {
      target: { value: "does not exist" },
    });

    expect(screen.queryByLabelText(/King Saud University/)).not.toBeInTheDocument();
    expect(screen.getByText("No matches found.")).toBeInTheDocument();
  });
});
