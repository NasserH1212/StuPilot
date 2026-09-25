import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/src/modules/terms/transport/term-actions", () => ({
  initialTermActionState: { status: "idle" },
  createTermAction: async () => ({ status: "idle" }),
  editTermAction: async () => ({ status: "idle" }),
  archiveTermAction: async () => ({ status: "idle" }),
  activateTermAction: async () => ({ status: "idle" }),
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

  it("offers activate but not archive-confirm for an inactive term", () => {
    render(<TermsView locale="en" terms={[inactiveTerm]} />);

    expect(screen.getByRole("button", { name: "Edit" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Activate" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Archive" })).toBeInTheDocument();
  });

  it("does not offer activate for the already-active term", () => {
    render(<TermsView locale="en" terms={[activeTerm]} />);

    expect(screen.queryByRole("button", { name: "Activate" })).not.toBeInTheDocument();
  });

  it("shows only the archived badge for an archived term, with no actions", () => {
    render(<TermsView locale="en" terms={[archivedTerm]} />);

    expect(screen.getByText("Archived")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Edit" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Archive" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Activate" })).not.toBeInTheDocument();
  });

  it("opens the edit form pre-filled with the term's current values", () => {
    render(<TermsView locale="en" terms={[activeTerm]} />);

    fireEvent.click(screen.getByRole("button", { name: "Edit" }));

    const heading = screen.getByRole("heading", { name: "Edit term" });
    expect(heading).toBeInTheDocument();
    const editForm = within(heading.closest("section") as HTMLElement);
    expect(editForm.getByLabelText("Term name")).toHaveValue("Fall 2026");
  });

  it("requires a second click to confirm archiving a term", () => {
    render(<TermsView locale="en" terms={[activeTerm]} />);

    fireEvent.click(screen.getByRole("button", { name: "Archive" }));

    expect(
      screen.getByText("Archiving this term cannot be undone. Continue?"),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Confirm archive" })).toBeInTheDocument();
  });
});
