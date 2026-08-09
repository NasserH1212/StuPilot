import { render } from "@testing-library/react";
import axe from "axe-core";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/src/modules/authentication/transport/auth-actions", () => ({
  initialAuthActionState: { status: "idle" },
  registerAction: async () => ({ status: "idle" }),
  signInAction: async () => ({ status: "idle" }),
  forgotPasswordAction: async () => ({ status: "idle" }),
  resetPasswordAction: async () => ({ status: "idle" }),
}));

import { AuthForm } from "@/src/modules/authentication/presentation/auth-form";

describe("authentication accessibility", () => {
  it.each([
    { locale: "ar", mode: "register" },
    { locale: "en", mode: "sign-in" },
    { locale: "ar", mode: "forgot-password" },
    { locale: "en", mode: "reset-password" },
  ] as const)(
    "has no structural axe violations for $locale $mode",
    async ({ locale, mode }) => {
      const { container } = render(<AuthForm locale={locale} mode={mode} />);
      const result = await axe.run(container, {
        rules: { "color-contrast": { enabled: false } },
      });
      expect(result.violations).toEqual([]);
    },
  );
});
