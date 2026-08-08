import { describe, expect, it } from "vitest";

import { getDictionary } from "@/src/shared/localization/dictionaries";
import {
  defaultLocale,
  getTextDirection,
  isLocale,
  resolveLocale,
} from "@/src/shared/localization/locales";
import { localizedPath } from "@/src/shared/localization/routing";

describe("localization foundation", () => {
  it("defines Arabic as the safe default and RTL locale", () => {
    expect(defaultLocale).toBe("ar");
    expect(getTextDirection("ar")).toBe("rtl");
    expect(getDictionary("ar").navigation.switchLanguage).toBe("English");
  });

  it("defines English as a first-class LTR locale", () => {
    expect(getTextDirection("en")).toBe("ltr");
    expect(getDictionary("en").navigation.switchLanguage).toBe("العربية");
  });

  it("rejects unsupported locales and falls back safely when requested", () => {
    expect(isLocale("fr")).toBe(false);
    expect(resolveLocale("fr")).toBe("ar");
    expect(resolveLocale(undefined)).toBe("ar");
  });

  it("builds only supported localized foundation routes", () => {
    expect(localizedPath("ar")).toBe("/ar");
    expect(localizedPath("en", "workspace")).toBe("/en/workspace");
  });
});
