"use client";

import type { Route } from "next";
import { useState } from "react";

import type { UniversityDisplay } from "@/src/modules/universities/presentation/university-display";
import {
  AcademicCard,
  AlertBanner,
  type AlertBannerKind,
  AppHeader,
  BottomNavigation,
  EmptyState,
  IconButton,
  IconChevronBack,
  IconChevronForward,
  SegmentedControl,
  WeekDayTab,
  WeekGridBlock,
  WeekGridEmptyCell,
} from "@/src/shared/design-system";
import type { Locale } from "@/src/shared/localization/locales";
import { localizedPath } from "@/src/shared/localization/routing";

import type { Weekday } from "../domain/class-meeting";
import { getWeekDictionary } from "./week-dictionary";
import { buildWeekGrid } from "./week-grid";
import type { WeekLectureItem } from "./week-lecture-items";
import { itemsForWeekday } from "./week-lecture-items";
import styles from "./week-view.module.css";

export interface WeekDayInfo {
  readonly weekday: Weekday;
  readonly dayLabel: string;
  readonly dateLabel: string;
  readonly isToday: boolean;
}

export interface WeekViewProps {
  readonly locale: Locale;
  readonly university: UniversityDisplay | null;
  readonly termName: string;
  readonly weekIndex: number;
  readonly totalWeeks: number;
  readonly weekRangeLabel: string;
  readonly days: readonly WeekDayInfo[];
  readonly initialSelectedWeekday: Weekday;
  readonly allWeekItems: readonly WeekLectureItem[];
  readonly isBreakWeek: boolean;
  readonly breakBanner?:
    | { readonly kind: AlertBannerKind; readonly title: string; readonly body: string }
    | undefined;
  readonly prevWeekHref: Route | null;
  readonly nextWeekHref: Route | null;
  readonly currentWeekHref: Route;
}

export function WeekView({
  locale,
  university,
  termName,
  weekIndex,
  totalWeeks,
  weekRangeLabel,
  days,
  initialSelectedWeekday,
  allWeekItems,
  isBreakWeek,
  breakBanner,
  prevWeekHref,
  nextWeekHref,
  currentWeekHref,
}: WeekViewProps) {
  const dictionary = getWeekDictionary(locale);
  const [view, setView] = useState<"list" | "grid">("list");
  const [selectedWeekday, setSelectedWeekday] =
    useState<Weekday>(initialSelectedWeekday);
  const [captureOpen, setCaptureOpen] = useState(false);

  const selectedDay = days.find((day) => day.weekday === selectedWeekday) ?? days[0];
  const selectedDayItems = itemsForWeekday(allWeekItems, selectedWeekday);
  const gridRows = buildWeekGrid(allWeekItems);

  return (
    <div className={styles.screen}>
      <div className={styles.content}>
        <AppHeader
          brandLabel="StuPilot"
          homeHref={localizedPath(locale, "workspace") as Route}
          university={university}
        />

        <div>
          <h1 className={styles.heading} dir="auto">
            {dictionary.weekOf(weekIndex, totalWeeks)}
          </h1>
          <p className={styles.dateRange} dir="auto">
            {weekRangeLabel}
          </p>
        </div>

        <div className={styles.weekNav}>
          <IconButton
            href={nextWeekHref ?? currentWeekHref}
            icon={<IconChevronForward />}
            aria-label={dictionary.nextWeek}
          />
          <span className={styles.termName} dir="auto">
            {termName}
          </span>
          <IconButton
            href={prevWeekHref ?? currentWeekHref}
            icon={<IconChevronBack />}
            aria-label={dictionary.previousWeek}
          />
        </div>

        <SegmentedControl<"list" | "grid">
          aria-label={dictionary.weekViewToggleLabel}
          value={view}
          onChange={setView}
          options={[
            { value: "grid", label: dictionary.gridView },
            { value: "list", label: dictionary.listView },
          ]}
        />

        <div className={styles.dayStrip}>
          {days.map((day) => (
            <WeekDayTab
              key={day.weekday}
              dayLabel={day.dayLabel}
              dateLabel={day.dateLabel}
              isToday={day.isToday}
              selected={day.weekday === selectedWeekday}
              hasDeadline={false}
              onSelect={() => setSelectedWeekday(day.weekday)}
            />
          ))}
        </div>

        {isBreakWeek ? (
          <>
            {breakBanner && (
              <AlertBanner
                kind={breakBanner.kind}
                title={breakBanner.title}
                body={breakBanner.body}
              />
            )}
            <EmptyState
              title={dictionary.breakEmptyTitle}
              description={dictionary.breakEmptyBody}
              actionLabel={dictionary.returnToCurrentWeek}
              onAction={() => {
                window.location.href = currentWeekHref;
              }}
            />
          </>
        ) : view === "list" ? (
          <>
            <h2 className={styles.sectionHeading} dir="auto">
              {selectedDay?.dayLabel}
              {selectedDay?.isToday ? ` · ${dictionary.today}` : ""}
            </h2>
            {selectedDayItems.length === 0 ? (
              <p className={styles.mutedNote} dir="auto">
                {dictionary.noLecturesToday}
              </p>
            ) : (
              <ul className={styles.list}>
                {selectedDayItems.map((item) => (
                  <li key={item.key}>
                    <AcademicCard
                      kind="lecture"
                      title={item.courseName}
                      time={{ start: item.start, end: item.end }}
                      course={
                        item.courseCode
                          ? { color: item.color, code: item.courseCode }
                          : undefined
                      }
                    />
                  </li>
                ))}
              </ul>
            )}
            <p className={styles.mutedNote} dir="auto">
              {dictionary.tasksAndExamsNotYetAvailable}
            </p>
          </>
        ) : (
          <>
            <h2 className={styles.sectionHeading} dir="auto">
              {dictionary.weekSchedule}
            </h2>
            <p className={styles.gridHint} dir="auto">
              {dictionary.weekScheduleHint}
            </p>
            <div className={styles.grid}>
              <div className={styles.gridHeaderRow}>
                <span />
                {days.map((day) => (
                  <span key={day.weekday} className={styles.gridHeaderCell} dir="auto">
                    {day.dayLabel}
                  </span>
                ))}
              </div>
              {gridRows.map((row) => (
                <div key={row.timeLabel} className={styles.gridRow}>
                  <span className={styles.gridTimeLabel} dir="ltr">
                    {row.timeLabel}
                  </span>
                  {days.map((day) => {
                    const item = row.cellsByWeekday.get(day.weekday);
                    return item ? (
                      <WeekGridBlock
                        key={day.weekday}
                        color={item.color}
                        courseCode={item.courseCode ?? ""}
                        label={item.courseName}
                      />
                    ) : (
                      <WeekGridEmptyCell key={day.weekday} />
                    );
                  })}
                </div>
              ))}
            </div>
            <p className={styles.mutedNote} dir="auto">
              {dictionary.tasksAndExamsNotYetAvailable}
            </p>
          </>
        )}
      </div>

      <BottomNavigation
        active="week"
        hrefFor={(key) =>
          ({
            profile: localizedPath(locale, "workspace"),
            courses: localizedPath(locale, "terms"),
            week: currentWeekHref,
            today: localizedPath(locale, "workspace"),
          })[key] as Route
        }
        captureOpen={captureOpen}
        onToggleCapture={() => setCaptureOpen((open) => !open)}
      />
    </div>
  );
}
