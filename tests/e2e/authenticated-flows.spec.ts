import { expect, test } from "@playwright/test";

// Opt-in, local-only coverage against a real, pre-verified Supabase account.
// Never runs in CI: CI intentionally configures no real auth provider (see
// .github/workflows/ci.yml and docs/engineering/testing.md), so these tests
// skip there exactly as they do for any developer who has not set the two
// env vars below. See docs/engineering/testing.md#signed-in-e2e-flows for
// how to provision the account.
const email = process.env.E2E_TEST_ACCOUNT_EMAIL;
const password = process.env.E2E_TEST_ACCOUNT_PASSWORD;

test.describe
  .serial("signed-in flows against a real, pre-verified test account", () => {
  test.skip(
    !email || !password,
    "Set E2E_TEST_ACCOUNT_EMAIL and E2E_TEST_ACCOUNT_PASSWORD to run this suite " +
      "against a real, pre-verified Supabase account. See docs/engineering/testing.md.",
  );

  test("signs in with a pre-verified account", async ({ page }) => {
    await page.goto("/en/auth/sign-in");
    await page.getByLabel("Email address").fill(email as string);
    await page.getByLabel("Password", { exact: true }).fill(password as string);
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page).toHaveURL(/\/en\/workspace(\/onboarding)?$/);
  });

  test("completes onboarding with University of Hail if not already done", async ({
    page,
  }) => {
    if (!page.url().endsWith("/workspace/onboarding")) {
      // A previous run already onboarded this account — confirm that
      // state instead of forcing a fresh one (see the setup doc for why
      // this suite reuses one long-lived account rather than a fresh one
      // per run).
      await expect(page).toHaveURL(/\/en\/workspace$/);
      return;
    }

    await page.getByLabel("English").check();
    await page.getByLabel("Time zone").fill("Asia/Riyadh");
    await page.getByLabel("Search for your university").fill("Hail");
    await page.getByLabel(/University of Hail/).check();
    await page.getByLabel("Major (optional)").fill("Computer Science");
    await page.getByRole("button", { name: "Continue to your first term" }).click();
    await expect(page).toHaveURL(/\/en\/workspace\/terms$/);
  });

  test("creates an academic term", async ({ page }) => {
    await page.goto("/en/workspace/terms");

    const termName = `E2E Term ${Date.now()}`;
    await page.getByLabel("Term name").fill(termName);
    await page.getByLabel("Start date").fill("2026-09-01");
    await page.getByLabel("End date").fill("2026-12-31");
    if (await page.getByLabel("Time zone").isEditable()) {
      await page.getByLabel("Time zone").fill("Asia/Riyadh");
    }
    await page.getByRole("button", { name: "Save term" }).click();

    await expect(page.getByText("The term was created successfully.")).toBeVisible();
    await expect(page.getByText(termName)).toBeVisible();
  });

  test("adds a course to the created term", async ({ page }) => {
    await page.goto("/en/workspace/terms");
    await page.getByRole("link", { name: "Courses" }).first().click();
    await expect(page).toHaveURL(/\/en\/workspace\/terms\/.+\/courses$/);

    const courseName = `E2E Course ${Date.now()}`;
    await page.getByLabel("Course name").fill(courseName);
    await page.getByRole("button", { name: "Save course" }).click();

    await expect(page.getByText("The course was added successfully.")).toBeVisible();
    await expect(page.getByText(courseName)).toBeVisible();
  });
});
