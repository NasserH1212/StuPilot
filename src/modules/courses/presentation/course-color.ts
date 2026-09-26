import type { CourseColor } from "@/src/shared/design-system";

const courseColors: readonly CourseColor[] = [
  "blue",
  "teal",
  "violet",
  "rose",
  "amber",
  "orange",
  "green",
  "slate",
];

function isCourseColor(value: string): value is CourseColor {
  return (courseColors as readonly string[]).includes(value);
}

/**
 * Courses have no user-facing color picker yet (`colorToken` is always
 * persisted as `null` — see course-actions.ts), so the tag color is derived
 * deterministically from a stable identifier. The same course always gets
 * the same color, and different courses spread across the palette.
 */
export function resolveCourseColor(
  colorToken: string | null,
  seed: string,
): CourseColor {
  if (colorToken && isCourseColor(colorToken)) return colorToken;

  let hash = 0;
  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) | 0;
  }
  const position = Math.abs(hash) % courseColors.length;
  return courseColors[position] as CourseColor;
}
