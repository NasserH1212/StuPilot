import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  redirect: vi.fn((path: string) => {
    throw new Error(`NEXT_REDIRECT:${path}`);
  }),
}));

vi.mock("@/src/composition/authentication", () => ({
  createAuthenticationRuntime: vi.fn(),
}));

vi.mock("@/src/composition/onboarding", () => ({
  createOnboardingService: vi.fn(),
}));

import { redirect } from "next/navigation";

import { createAuthenticationRuntime } from "@/src/composition/authentication";
import { createOnboardingService } from "@/src/composition/onboarding";
import { OnboardingError } from "@/src/modules/onboarding/application/onboarding-error";
import { completeOnboardingAction } from "@/src/modules/onboarding/transport/onboarding-actions";

const userId = "018f57b5-f220-7d84-bafd-4d975e550001";

function form(fields: Record<string, string>): FormData {
  const data = new FormData();
  for (const [key, value] of Object.entries(fields)) data.set(key, value);
  return data;
}

function fakeService(overrides: Record<string, unknown> = {}) {
  return {
    getProfile: vi.fn(),
    completeOnboarding: vi.fn(),
    ...overrides,
  };
}

function mockAvailableAccount(): void {
  vi.mocked(createAuthenticationRuntime).mockResolvedValue({
    available: true,
    service: { currentAccount: vi.fn().mockResolvedValue({ id: userId }) },
  } as never);
}

describe("completeOnboardingAction", () => {
  beforeEach(() => {
    vi.mocked(createAuthenticationRuntime).mockReset();
    vi.mocked(createOnboardingService).mockReset();
    vi.mocked(redirect).mockClear();
  });

  it("rejects an unsupported locale before touching authentication", async () => {
    const result = await completeOnboardingAction(
      { status: "idle" },
      form({ locale: "fr", timeZone: "Asia/Riyadh" }),
    );

    expect(result).toEqual({
      status: "error",
      code: "VALIDATION_ERROR",
      fieldErrors: { locale: true },
    });
    expect(createAuthenticationRuntime).not.toHaveBeenCalled();
  });

  it("rejects a blank time zone", async () => {
    const result = await completeOnboardingAction(
      { status: "idle" },
      form({ locale: "en", timeZone: "" }),
    );

    expect(result).toEqual({
      status: "error",
      code: "VALIDATION_ERROR",
      fieldErrors: { timeZone: true },
    });
  });

  it("reports the service as unavailable when authentication cannot be reached", async () => {
    vi.mocked(createAuthenticationRuntime).mockResolvedValue({
      available: false,
    } as never);

    const result = await completeOnboardingAction(
      { status: "idle" },
      form({ locale: "en", timeZone: "Asia/Riyadh" }),
    );

    expect(result).toEqual({ status: "error", code: "UNAVAILABLE" });
    expect(createOnboardingService).not.toHaveBeenCalled();
  });

  it("completes onboarding for the current account and redirects to the first-term path", async () => {
    mockAvailableAccount();
    const service = fakeService();
    vi.mocked(createOnboardingService).mockReturnValue(service as never);

    await expect(
      completeOnboardingAction(
        { status: "idle" },
        form({ locale: "en", timeZone: "Asia/Riyadh" }),
      ),
    ).rejects.toThrow("NEXT_REDIRECT:/en/workspace/terms");

    expect(service.completeOnboarding).toHaveBeenCalledWith(userId, {
      locale: "en",
      timeZone: "Asia/Riyadh",
    });
  });

  it("maps an invalid onboarding profile to a time-zone field error", async () => {
    mockAvailableAccount();
    const service = fakeService({
      completeOnboarding: vi
        .fn()
        .mockRejectedValue(
          new OnboardingError(
            "ONBOARDING_INVALID",
            "The onboarding profile is invalid.",
          ),
        ),
    });
    vi.mocked(createOnboardingService).mockReturnValue(service as never);

    const result = await completeOnboardingAction(
      { status: "idle" },
      form({ locale: "en", timeZone: "Asia/Riyadh" }),
    );

    expect(result).toEqual({
      status: "error",
      code: "VALIDATION_ERROR",
      fieldErrors: { timeZone: true },
    });
    expect(redirect).not.toHaveBeenCalled();
  });
});
