"use client";

import type { Route } from "next";
import { useRouter } from "next/navigation";

import type { UniversityDisplay } from "@/src/modules/universities/presentation/university-display";
import { AppHeader, BottomNavigation, EmptyState } from "@/src/shared/design-system";
import type { Locale } from "@/src/shared/localization/locales";
import { localizedPath } from "@/src/shared/localization/routing";

import { getWeekDictionary } from "./week-dictionary";
import styles from "./week-view.module.css";

export function WeekNoActiveTermView({
  locale,
  university,
}: {
  readonly locale: Locale;
  readonly university: UniversityDisplay | null;
}) {
  const dictionary = getWeekDictionary(locale);
  const router = useRouter();
  const weekHref = `/${locale}/workspace/week` as Route;

  return (
    <div className={styles.screen}>
      <div className={styles.content}>
        <AppHeader
          brandLabel="StuPilot"
          homeHref={localizedPath(locale, "workspace") as Route}
          university={university}
        />
        <EmptyState
          title={dictionary.noActiveTerm}
          description={dictionary.noActiveTermBody}
          actionLabel={dictionary.goToTerms}
          onAction={() => router.push(localizedPath(locale, "terms"))}
        />
      </div>
      <BottomNavigation
        active="week"
        hrefFor={(key) =>
          ({
            profile: localizedPath(locale, "workspace"),
            courses: localizedPath(locale, "terms"),
            week: weekHref,
            today: localizedPath(locale, "workspace"),
          })[key] as Route
        }
        captureOpen={false}
        onToggleCapture={() => {}}
      />
    </div>
  );
}
