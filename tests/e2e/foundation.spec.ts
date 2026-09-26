import { createRequire } from "node:module";

import { expect, test } from "@playwright/test";

const require = createRequire(import.meta.url);
const axePath = require.resolve("axe-core/axe.min.js");

test("the root safely selects Arabic and emits matching direction in the first response", async ({
  page,
}) => {
  const response = await page.goto("/");
  expect(response?.status()).toBe(200);
  await expect(page).toHaveURL(/\/ar$/);
  await expect(page).toHaveTitle(/StuPilot/);
  await expect(page.locator("html")).toHaveAttribute("lang", "ar");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
});

test("Arabic and English first responses do not require hydration direction correction", async ({
  page,
}) => {
  const hydrationErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error" && /hydration|did not match/i.test(message.text())) {
      hydrationErrors.push(message.text());
    }
  });

  for (const locale of ["ar", "en"] as const) {
    const response = await page.goto(`/${locale}`);
    const html = await response?.text();
    const expectedDirection = locale === "ar" ? "rtl" : "ltr";
    expect(html).toMatch(
      new RegExp(
        `<html[^>]*lang=["']${locale}["'][^>]*dir=["']${expectedDirection}["']`,
      ),
    );
    await expect(page.locator("html")).toHaveAttribute("dir", expectedDirection);
  }

  expect(hydrationErrors).toEqual([]);
});

test("an unsupported locale is rejected with a safe not-found response", async ({
  page,
}) => {
  const response = await page.goto("/fr");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "الصفحة غير موجودة" })).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("lang", "ar");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
});

test("the shell fits a 320px viewport without horizontal overflow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto("/ar");
  await expect(page.getByRole("main")).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});

test("the protected workspace fails closed, or requires sign-in, depending on the real authentication environment", async ({
  page,
}) => {
  // Whether Supabase is configured (and reachable) varies with the real
  // .env.local this suite runs against — a from-scratch checkout has none of
  // it, a local dev environment usually has credentials but no reachable
  // hosted project yet, and a fully qualified environment has both. Rather
  // than assume one of those, read the actual outcome and assert the
  // fail-closed invariant that must hold for it: the protected workspace
  // never renders, and every redirect target is one this app is expected to
  // produce.
  await page.setViewportSize({ width: 1440, height: 900 });
  const response = await page.goto("/en/workspace");
  expect(response?.headers()["cache-control"]).toContain("no-store");

  const url = new URL(page.url());
  if (url.pathname === "/en/auth/unavailable") {
    const reason = url.searchParams.get("reason");
    expect(["configuration", "provider"]).toContain(reason);
    await expect(
      page.getByRole("heading", { name: "Authentication is currently unavailable" }),
    ).toBeVisible();
    if (reason === "configuration") {
      await expect(
        page.getByText(/No substitute account or session was created/),
      ).toBeVisible();
    }
  } else {
    await expect(page).toHaveURL(/\/en\/auth\/sign-in\?returnTo=%2Fen%2Fworkspace$/);
  }
});

test("public authentication routes fail closed without configuration, and otherwise never trust the returnTo query", async ({
  page,
}) => {
  const response = await page.goto(
    "/en/auth/sign-in?returnTo=https%3A%2F%2Fattacker.invalid",
  );
  expect(response?.headers()["cache-control"]).toContain("no-store");

  const unavailable = page.getByRole("heading", {
    name: "Authentication is currently unavailable",
  });
  if (await unavailable.isVisible().catch(() => false)) {
    await expect(page.getByLabel("Email address")).toHaveCount(0);
  } else {
    // Supabase is configured, so the real form renders; the attacker-supplied
    // returnTo must still have been discarded for the safe workspace default.
    await expect(page.getByLabel("Email address")).toBeVisible();
    await expect(page.locator('input[name="returnTo"]')).toHaveValue("/en/workspace");
  }
});

test("malformed callback links are stripped and shown as localized failures", async ({
  page,
}) => {
  await page.goto("/ar/auth/callback?token_hash=not-accepted&type=unknown");
  await expect(page).toHaveURL(/\/ar\/auth\/link-error\?reason=invalid$/);
  await expect(
    page.getByRole("heading", { name: "رابط المصادقة غير صالح" }),
  ).toBeVisible();
});

test("the current-session API is private and fails closed for whichever real authentication state is configured", async ({
  request,
}) => {
  const response = await request.get("/api/v1/session");
  expect(response.headers()["cache-control"]).toContain("no-store");
  const body = await response.json();

  // A fresh Playwright context carries no session cookie, so the only valid
  // outcomes are the three fail-closed/unauthenticated codes the route can
  // return — never a 200 with session data.
  const validCodes = [
    "AUTH_CONFIGURATION_UNAVAILABLE",
    "AUTH_PROVIDER_UNAVAILABLE",
    "AUTHENTICATION_REQUIRED",
  ];
  expect(validCodes).toContain(body.error?.code);
  expect(response.status()).toBe(
    body.error.code === "AUTHENTICATION_REQUIRED" ? 401 : 503,
  );
});

test("keyboard users reach a visible skip link and main content", async ({ page }) => {
  await page.goto("/en");
  await page.keyboard.press("Tab");
  const skipLink = page.getByRole("link", { name: "Skip to main content" });
  await expect(skipLink).toBeFocused();
  expect(
    await skipLink.evaluate((element) => getComputedStyle(element).outlineStyle),
  ).not.toBe("none");
  await page.keyboard.press("Enter");
  await expect(page.getByRole("main")).toBeFocused();
});

test("the rendered shell has no serious automated accessibility violations", async ({
  page,
}) => {
  await page.goto("/ar");
  await page.addScriptTag({ path: axePath });
  const violations = await page.evaluate(async () => {
    const axe = (
      window as unknown as {
        axe: {
          run: () => Promise<{
            violations: Array<{ impact: string | null; id: string }>;
          }>;
        };
      }
    ).axe;
    const result = await axe.run();
    return result.violations.filter((violation) =>
      ["serious", "critical"].includes(violation.impact ?? ""),
    );
  });
  expect(violations).toEqual([]);
});
