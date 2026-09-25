import type { Locale } from "./locales";

export type LocalizedDestination =
  | "home"
  | "workspace"
  | "terms"
  | "sign-in"
  | "register"
  | "verification-pending"
  | "verified"
  | "forgot-password"
  | "reset-password"
  | "link-error"
  | "authentication-unavailable";

export type LocalizedPath =
  | `/${Locale}`
  | `/${Locale}/workspace`
  | `/${Locale}/workspace/terms`
  | `/${Locale}/auth/sign-in`
  | `/${Locale}/auth/register`
  | `/${Locale}/auth/verification-pending`
  | `/${Locale}/auth/verified`
  | `/${Locale}/auth/forgot-password`
  | `/${Locale}/auth/reset-password`
  | `/${Locale}/auth/link-error`
  | `/${Locale}/auth/unavailable`;

export function localizedPath(
  locale: Locale,
  destination: LocalizedDestination = "home",
): LocalizedPath {
  const suffixes: Record<LocalizedDestination, string> = {
    home: "",
    workspace: "/workspace",
    terms: "/workspace/terms",
    "sign-in": "/auth/sign-in",
    register: "/auth/register",
    "verification-pending": "/auth/verification-pending",
    verified: "/auth/verified",
    "forgot-password": "/auth/forgot-password",
    "reset-password": "/auth/reset-password",
    "link-error": "/auth/link-error",
    "authentication-unavailable": "/auth/unavailable",
  };

  return `/${locale}${suffixes[destination]}` as LocalizedPath;
}

export function localizedDestinationFromPath(
  pathname: string | null,
): LocalizedDestination {
  if (!pathname) return "home";
  if (pathname.endsWith("/workspace/terms")) return "terms";
  if (pathname.endsWith("/workspace")) return "workspace";
  if (pathname.endsWith("/auth/sign-in")) return "sign-in";
  if (pathname.endsWith("/auth/register")) return "register";
  if (pathname.endsWith("/auth/verification-pending")) {
    return "verification-pending";
  }
  if (pathname.endsWith("/auth/verified")) return "verified";
  if (pathname.endsWith("/auth/forgot-password")) return "forgot-password";
  if (pathname.endsWith("/auth/reset-password")) return "reset-password";
  if (pathname.endsWith("/auth/link-error")) return "link-error";
  if (pathname.endsWith("/auth/unavailable")) {
    return "authentication-unavailable";
  }
  return "home";
}

export function safeWorkspaceReturnTo(
  candidate: string | null | undefined,
  locale: Locale,
): LocalizedPath {
  const workspace = localizedPath(locale, "workspace");
  const allowedDestinations = new Set<string>([workspace]);
  return candidate && allowedDestinations.has(candidate)
    ? (candidate as LocalizedPath)
    : workspace;
}
