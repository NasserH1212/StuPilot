"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";

import { themeStorageKey } from "./theme-script";

export type ThemePreference = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

interface ThemeContextValue {
  readonly preference: ThemePreference;
  readonly setPreference: (preference: ThemePreference) => void;
  readonly resolvedTheme: ResolvedTheme;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function readStoredPreference(): ThemePreference {
  if (typeof window === "undefined") return "system";
  const stored = window.localStorage.getItem(themeStorageKey);
  return stored === "light" || stored === "dark" ? stored : "system";
}

function readSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeProvider({ children }: { readonly children: ReactNode }) {
  const [preference, setPreferenceState] = useState<ThemePreference>("system");
  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>("light");

  useEffect(() => {
    // Deferred to an effect (not a lazy useState initializer) so the server
    // and first client render both produce "system"/"light" and stay in
    // sync with `themeBootScript`'s pre-paint DOM attribute; reading
    // localStorage/matchMedia during the initial client render would
    // desync from the server-rendered markup and trigger a hydration
    // mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPreferenceState(readStoredPreference());
    setSystemTheme(readSystemTheme());

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (event: MediaQueryListEvent) => {
      setSystemTheme(event.matches ? "dark" : "light");
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const setPreference = useCallback((next: ThemePreference) => {
    setPreferenceState(next);
    try {
      if (next === "system") {
        window.localStorage.removeItem(themeStorageKey);
        document.documentElement.removeAttribute("data-theme");
      } else {
        window.localStorage.setItem(themeStorageKey, next);
        document.documentElement.setAttribute("data-theme", next);
      }
    } catch {
      // Storage can be unavailable (private browsing); the in-memory
      // preference above still drives this tab's rendering.
    }
  }, []);

  const resolvedTheme: ResolvedTheme =
    preference === "system" ? systemTheme : preference;

  const value = useMemo(
    () => ({ preference, setPreference, resolvedTheme }),
    [preference, setPreference, resolvedTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
}
