export const sundayWeekStart = 0 as const;

export type WeekStart = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface TimePreferenceDefaults {
  readonly weekStartsOn: WeekStart;
  readonly timeZoneSource: "browser-until-user-preference-exists";
}

export const timePreferenceDefaults: TimePreferenceDefaults = {
  weekStartsOn: sundayWeekStart,
  timeZoneSource: "browser-until-user-preference-exists",
};
