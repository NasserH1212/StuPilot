import { render } from "@testing-library/react";
import axe from "axe-core";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/src/modules/authentication/transport/auth-actions", () => ({
  initialAuthActionState: { status: "idle" },
  signOutAction: async () => ({ status: "idle" }),
}));

import { ApplicationPlaceholderView } from "@/src/modules/foundation/presentation/application-placeholder-view";
import { LandingView } from "@/src/modules/foundation/presentation/landing-view";
import { SiteShell } from "@/src/modules/foundation/presentation/site-shell";

describe("foundation accessibility", () => {
  it.each([
    {
      name: "Arabic public shell",
      view: (
        <SiteShell locale="ar" destination="home">
          <LandingView locale="ar" />
        </SiteShell>
      ),
    },
    {
      name: "English application shell",
      view: (
        <SiteShell locale="en" destination="workspace">
          <ApplicationPlaceholderView locale="en" />
        </SiteShell>
      ),
    },
    {
      name: "English signed-in shell",
      view: (
        <SiteShell locale="en" destination="home" authenticated>
          <LandingView locale="en" />
        </SiteShell>
      ),
    },
  ])("has no automated axe violations in the $name", async ({ view }) => {
    const { container } = render(view);
    const result = await axe.run(container, {
      // JSDOM has no layout/canvas contrast model; real Chromium covers this rule.
      rules: { "color-contrast": { enabled: false } },
    });
    expect(result.violations).toEqual([]);
  });
});
