import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/src/modules/terms/transport/term-actions", () => ({
  initialTermActionState: { status: "idle" },
  createTermAction: async () => ({ status: "idle" }),
}));

import type { TermRecord } from "@/src/modules/terms/application/ports/term-repository";
import { TermCreateForm } from "@/src/modules/terms/presentation/term-create-form";
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

describe("academic term views", () => {
  it("renders the Arabic create form with required fields", () => {
    render(<TermCreateForm locale="ar" />);

    expect(screen.getByRole("heading", { name: "إضافة فصل جديد" })).toBeInTheDocument();
    expect(screen.getByLabelText("اسم الفصل")).toBeRequired();
    expect(screen.getByRole("button", { name: "حفظ الفصل" })).toBeEnabled();
  });

  it("shows the English empty state when no terms exist", () => {
    render(<TermsView locale="en" terms={[]} />);

    expect(
      screen.getByRole("heading", { name: "Your academic terms" }),
    ).toBeInTheDocument();
    expect(screen.getByText("No terms yet")).toBeInTheDocument();
  });

  it("lists an existing term with its active badge", () => {
    render(<TermsView locale="en" terms={[activeTerm]} />);

    expect(screen.getByText("Fall 2026")).toBeInTheDocument();
    expect(screen.getByText("Active")).toBeInTheDocument();
  });
});
