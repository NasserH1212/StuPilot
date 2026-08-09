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

test("the protected workspace fails closed without authentication configuration", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  const response = await page.goto("/en/workspace");
  expect(response?.headers()["cache-control"]).toContain("no-store");
  await expect(page).toHaveURL(/\/en\/auth\/unavailable\?reason=configuration$/);
  await expect(
    page.getByRole("heading", { name: "Authentication is currently unavailable" }),
  ).toBeVisible();
  await expect(
    page.getByText(/No substitute account or session was created/),
  ).toBeVisible();
});

test("public authentication routes fail closed without rendering credential forms", async ({
  page,
}) => {
  const response = await page.goto(
    "/en/auth/sign-in?returnTo=https%3A%2F%2Fattacker.invalid",
  );
  expect(response?.headers()["cache-control"]).toContain("no-store");
  await expect(
    page.getByRole("heading", { name: "Authentication is currently unavailable" }),
  ).toBeVisible();
  await expect(page.getByLabel("Email address")).toHaveCount(0);
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

test("the current-session API is private and unavailable without real configuration", async ({
  request,
}) => {
  const response = await request.get("/api/v1/session");
  expect(response.status()).toBe(503);
  expect(response.headers()["cache-control"]).toContain("no-store");
  expect(await response.json()).toEqual({
    error: { code: "AUTH_CONFIGURATION_UNAVAILABLE" },
  });
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
