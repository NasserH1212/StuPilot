import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/src/modules/courses/transport/course-actions", () => ({
  initialCourseActionState: { status: "idle" },
  createCourseAction: async () => ({ status: "idle" }),
  editCourseAction: async () => ({ status: "idle" }),
  archiveCourseAction: async () => ({ status: "idle" }),
}));

import type { TermCourseRecord } from "@/src/modules/courses/application/ports/course-repository";
import { CoursesView } from "@/src/modules/courses/presentation/courses-view";
import type { TermRecord } from "@/src/modules/terms/application/ports/term-repository";

const term: TermRecord = {
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

const activeCourse: TermCourseRecord = {
  enrollmentId: "018f57b5-f220-7d84-bafd-4d975e550200",
  courseId: "018f57b5-f220-7d84-bafd-4d975e550300",
  userId: term.userId,
  termId: term.id,
  name: "Calculus I",
  code: "MATH101",
  colorToken: null,
  defaultLocation: "Building A",
  archivedAt: null,
  courseVersion: 0,
  enrollmentVersion: 0,
  createdAt: new Date("2026-08-01T00:00:00.000Z"),
  updatedAt: new Date("2026-08-01T00:00:00.000Z"),
};

const archivedCourse: TermCourseRecord = {
  ...activeCourse,
  enrollmentId: "018f57b5-f220-7d84-bafd-4d975e550201",
  name: "Physics I",
  archivedAt: new Date("2026-09-01T00:00:00.000Z"),
};

describe("course views", () => {
  it("shows the English empty state when no courses exist", () => {
    render(<CoursesView locale="en" term={term} courses={[]} university={null} />);

    expect(screen.getByText("No courses yet")).toBeInTheDocument();
  });

  it("lists an existing course with its code and location", () => {
    render(
      <CoursesView
        locale="en"
        term={term}
        courses={[activeCourse]}
        university={null}
      />,
    );

    expect(screen.getByText("Calculus I")).toBeInTheDocument();
    expect(screen.getByText("MATH101")).toBeInTheDocument();
    expect(screen.getByText("Building A")).toBeInTheDocument();
  });

  it("shows only the archived badge for an archived course, with no actions", () => {
    render(
      <CoursesView
        locale="en"
        term={term}
        courses={[archivedCourse]}
        university={null}
      />,
    );

    expect(screen.getByText("Archived")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Edit" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Archive" })).not.toBeInTheDocument();
  });

  it("opens the edit form pre-filled with the course's current values", () => {
    render(
      <CoursesView
        locale="en"
        term={term}
        courses={[activeCourse]}
        university={null}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Edit" }));

    const heading = screen.getByRole("heading", { name: "Edit course" });
    expect(heading).toBeInTheDocument();
    const editForm = within(heading.closest("section") as HTMLElement);
    expect(editForm.getByLabelText("Course name")).toHaveValue("Calculus I");
  });

  it("requires a second click to confirm archiving a course", () => {
    render(
      <CoursesView
        locale="en"
        term={term}
        courses={[activeCourse]}
        university={null}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Archive" }));

    expect(
      screen.getByText("This hides the course from this term's lists. Continue?"),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Confirm archive" })).toBeInTheDocument();
  });
});
