import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ApplicationPlaceholderView } from "@/src/modules/foundation/presentation/application-placeholder-view";
import { LandingView } from "@/src/modules/foundation/presentation/landing-view";
import { SiteShell } from "@/src/modules/foundation/presentation/site-shell";

describe("foundation shell rendering", () => {
  it("renders a clean Arabic public shell with the production sign-in entry", () => {
    render(
      <SiteShell locale="ar" destination="home">
        <LandingView locale="ar" />
      </SiteShell>,
    );

    expect(
      screen.getByRole("heading", { name: "مساحة أكاديمية واضحة تبدأ بلغتك." }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "English" })).toHaveAttribute(
      "href",
      "/en",
    );
    expect(screen.getByRole("link", { name: "تسجيل الدخول" })).toHaveAttribute(
      "href",
      "/ar/auth/sign-in",
    );
    expect(screen.getByRole("link", { name: "StuPilot" })).toHaveAttribute(
      "href",
      "/ar",
    );
  });

  it("renders the English application placeholder and states its limits", () => {
    render(
      <SiteShell locale="en" destination="workspace">
        <ApplicationPlaceholderView locale="en" />
      </SiteShell>,
    );

    expect(
      screen.getByRole("heading", { name: "Protected application shell" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Authentication is not active in Sprint 0/),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "العربية" })).toHaveAttribute(
      "href",
      "/ar/workspace",
    );
  });
});
