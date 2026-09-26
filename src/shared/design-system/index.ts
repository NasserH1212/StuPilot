export { Button } from "./Button/Button";
export type { ButtonProps, ButtonVariant } from "./Button/Button";

export { LinkButton } from "./Button/LinkButton";
export type { LinkButtonProps } from "./Button/LinkButton";

export { Spinner } from "./Spinner/Spinner";

export { Input } from "./Input/Input";
export type { InputProps } from "./Input/Input";

export { Radio } from "./Radio/Radio";
export type { RadioProps } from "./Radio/Radio";

export { Chip } from "./Chip/Chip";
export type { ChipProps } from "./Chip/Chip";

export { SegmentedControl } from "./SegmentedControl/SegmentedControl";
export type {
  SegmentedControlOption,
  SegmentedControlProps,
} from "./SegmentedControl/SegmentedControl";

export { Switch } from "./Switch/Switch";
export type { SwitchProps } from "./Switch/Switch";

export { ThemeSwitch } from "./ThemeSwitch/ThemeSwitch";

export { CourseColorTag } from "./CourseColorTag/CourseColorTag";
export type { CourseColor, CourseColorTagProps } from "./CourseColorTag/CourseColorTag";

export { CountdownBadge } from "./CountdownBadge/CountdownBadge";
export type {
  CountdownBadgeProps,
  CountdownTone,
} from "./CountdownBadge/CountdownBadge";

export { AlertBanner } from "./AlertBanner/AlertBanner";
export type { AlertBannerKind, AlertBannerProps } from "./AlertBanner/AlertBanner";

export { TimeRange } from "./TimeRange/TimeRange";
export type { TimeOfDay, TimeRangeProps } from "./TimeRange/TimeRange";

export { TaskCheckbox } from "./TaskCheckbox/TaskCheckbox";
export type { TaskCheckboxProps } from "./TaskCheckbox/TaskCheckbox";

export { AcademicCard } from "./AcademicCard/AcademicCard";
export type { AcademicCardKind, AcademicCardProps } from "./AcademicCard/AcademicCard";

export { EmptyState } from "./EmptyState/EmptyState";
export type { EmptyStateProps } from "./EmptyState/EmptyState";

export { Skeleton } from "./Skeleton/Skeleton";
export type { SkeletonKind, SkeletonProps } from "./Skeleton/Skeleton";

export { BottomNavigation } from "./BottomNavigation/BottomNavigation";
export type {
  BottomNavigationProps,
  NavKey,
} from "./BottomNavigation/BottomNavigation";

export { AppHeader } from "./AppHeader/AppHeader";
export type { AppHeaderProps } from "./AppHeader/AppHeader";

export { UniversityMonogram } from "./UniversityMonogram/UniversityMonogram";
export type { UniversityMonogramProps } from "./UniversityMonogram/UniversityMonogram";

export { IconButton } from "./IconButton/IconButton";
export type { IconButtonProps } from "./IconButton/IconButton";

export { CourseListItem } from "./CourseListItem/CourseListItem";
export type { CourseListItemProps } from "./CourseListItem/CourseListItem";

export { ThemeProvider, useTheme } from "./theme/theme-context";
export type { ResolvedTheme, ThemePreference } from "./theme/theme-context";
export { themeBootScript } from "./theme/theme-script";

export { IconChevronBack } from "./icons/icons";

// `fonts.ts` is deliberately NOT re-exported here: it calls `next/font/google`
// at module scope, which only works inside Next's build pipeline. Pulling it
// into this barrel would make every consumer (including component/a11y
// tests running under plain Vitest) transitively import it and crash. The
// root layout imports `@/src/shared/design-system/fonts` directly instead.
