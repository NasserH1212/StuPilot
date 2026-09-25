import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/src/modules/authentication/transport/auth-actions", () => ({
  initialAuthActionState: { status: "idle" },
  signOutAction: async () => ({ status: "idle" }),
}));

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

  it("shows sign-in and the application shell link when signed out", () => {
    render(
      <SiteShell locale="en" destination="home" authenticated={false}>
        <LandingView locale="en" />
      </SiteShell>,
    );

    expect(screen.getByRole("link", { name: "Sign in" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Application shell" })).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: "Academic terms" }),
    ).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Sign out" })).not.toBeInTheDocument();
  });

  it("shows the terms link and sign-out action when signed in", () => {
    render(
      <SiteShell locale="en" destination="home" authenticated>
        <LandingView locale="en" />
      </SiteShell>,
    );

    expect(screen.getByRole("link", { name: "Academic terms" })).toHaveAttribute(
      "href",
      "/en/workspace/terms",
    );
    expect(screen.getByRole("button", { name: "Sign out" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Sign in" })).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: "Application shell" }),
    ).not.toBeInTheDocument();
  });
});
