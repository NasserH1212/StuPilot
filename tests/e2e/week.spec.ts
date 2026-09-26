import { expect, test } from "@playwright/test";

// Whether Supabase is configured (and reachable) varies with the real
// .env.local this suite runs against, exactly as documented in
// foundation.spec.ts's workspace test. This asserts the fail-closed
// invariant that must hold in every one of those environments, rather than
// assuming a specific one.
test("the week page fails closed, or requires sign-in, depending on the real authentication environment", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 900 });
  const response = await page.goto("/en/workspace/week");
  expect(response?.headers()["cache-control"]).toContain("no-store");

  // Unlike /workspace itself (redirected by proxy.ts to /auth/unavailable),
  // this page — like the courses pages — renders AuthUnavailableView inline
  // at its own URL when unconfigured or the provider is unreachable; it only
  // navigates away when the provider works but no session exists.
  const unavailable = page.getByRole("heading", {
    name: "Authentication is currently unavailable",
  });
  if (await unavailable.isVisible().catch(() => false)) {
    await expect(unavailable).toBeVisible();
  } else {
    await expect(page).toHaveURL(/\/en\/auth\/sign-in\?returnTo=%2Fen%2Fworkspace$/);
  }
});
