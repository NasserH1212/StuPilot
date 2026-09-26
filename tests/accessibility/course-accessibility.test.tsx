import { render } from "@testing-library/react";
import axe from "axe-core";
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

describe("course accessibility", () => {
  it.each([
    { name: "empty state", courses: [] as TermCourseRecord[] },
    { name: "populated list", courses: [activeCourse] },
  ] as const)("has no structural axe violations in the $name", async ({ courses }) => {
    const { container } = render(
      <CoursesView locale="en" term={term} courses={courses} university={null} />,
    );
    const result = await axe.run(container, {
      rules: { "color-contrast": { enabled: false } },
    });
    expect(result.violations).toEqual([]);
  });
});
