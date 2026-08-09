import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/src/modules/authentication/transport/auth-actions", () => ({
  initialAuthActionState: { status: "idle" },
  registerAction: async () => ({ status: "idle" }),
  signInAction: async () => ({ status: "idle" }),
  forgotPasswordAction: async () => ({ status: "idle" }),
  resetPasswordAction: async () => ({ status: "idle" }),
}));

import { AuthForm } from "@/src/modules/authentication/presentation/auth-form";
import { AuthUnavailableView } from "@/src/modules/authentication/presentation/auth-unavailable-view";

describe("localized authentication forms", () => {
  it("renders a complete Arabic registration form with isolated credential inputs", () => {
    render(<AuthForm locale="ar" mode="register" />);

    expect(screen.getByRole("heading", { name: "إنشاء حساب" })).toBeInTheDocument();
    expect(screen.getByLabelText("البريد الإلكتروني")).toHaveAttribute("dir", "ltr");
    expect(screen.getByLabelText("كلمة المرور")).toHaveAttribute(
      "autocomplete",
      "new-password",
    );
    expect(screen.getByLabelText("تأكيد كلمة المرور")).toBeRequired();
    expect(screen.getByRole("button", { name: "إنشاء الحساب" })).toBeEnabled();
  });

  it("renders English sign-in without exposing a caller-controlled return URL", () => {
    render(<AuthForm locale="en" mode="sign-in" returnTo="/en/workspace" />);

    expect(screen.getByRole("heading", { name: "Sign in" })).toBeInTheDocument();
    expect(screen.getByDisplayValue("/en/workspace")).toHaveAttribute(
      "name",
      "returnTo",
    );
    expect(screen.getByRole("link", { name: "Forgot your password?" })).toHaveAttribute(
      "href",
      "/en/auth/forgot-password",
    );
  });

  it("states configuration failure without rendering a fake login form", () => {
    render(<AuthUnavailableView locale="en" />);
    expect(
      screen.getByRole("heading", { name: "Authentication is currently unavailable" }),
    ).toBeInTheDocument();
    expect(screen.queryByLabelText("Email address")).not.toBeInTheDocument();
  });
});
