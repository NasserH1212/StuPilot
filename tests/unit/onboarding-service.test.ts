import { describe, expect, it } from "vitest";

import { OnboardingService } from "@/src/modules/onboarding/application/onboarding-service";
import type {
  OnboardingCompletion,
  OnboardingProfileRecord,
  OnboardingRepository,
} from "@/src/modules/onboarding/application/ports/onboarding-repository";

const baseProfile: OnboardingProfileRecord = {
  userId: "018f57b5-f220-7d84-bafd-4d975e550001",
  locale: "en",
  timeZone: "Asia/Riyadh",
  university: "State University",
  major: "Computer Science",
  completedAt: new Date("2026-09-01T00:00:00.000Z"),
};

function repository(
  overrides: Partial<OnboardingRepository> = {},
): OnboardingRepository {
  return {
    findForUser: async () => null,
    complete: async () => baseProfile,
    ...overrides,
  };
}

describe("onboarding application service", () => {
  it("trims the time zone and delegates completion to the repository", async () => {
    let received: OnboardingCompletion | undefined;
    const service = new OnboardingService(
      repository({
        complete: async (_userId, completion) => {
          received = completion;
          return { ...baseProfile, timeZone: completion.timeZone };
        },
      }),
    );

    const result = await service.completeOnboarding(baseProfile.userId, {
      locale: "en",
      timeZone: "  Asia/Riyadh  ",
      university: null,
      major: null,
    });

    expect(received?.timeZone).toBe("Asia/Riyadh");
    expect(result.timeZone).toBe("Asia/Riyadh");
  });

  it("trims optional university and major, converting blank to null", async () => {
    let received: OnboardingCompletion | undefined;
    const service = new OnboardingService(
      repository({
        complete: async (_userId, completion) => {
          received = completion;
          return baseProfile;
        },
      }),
    );

    await service.completeOnboarding(baseProfile.userId, {
      locale: "en",
      timeZone: "Asia/Riyadh",
      university: "  State University  ",
      major: "   ",
    });

    expect(received?.university).toBe("State University");
    expect(received?.major).toBeNull();
  });

  it("rejects a blank time zone as invalid", async () => {
    const service = new OnboardingService(repository());

    await expect(
      service.completeOnboarding(baseProfile.userId, {
        locale: "en",
        timeZone: "   ",
        university: null,
        major: null,
      }),
    ).rejects.toMatchObject({ code: "ONBOARDING_INVALID" });
  });

  it("returns null when no profile exists yet for the user", async () => {
    const service = new OnboardingService(
      repository({ findForUser: async () => null }),
    );

    await expect(service.getProfile(baseProfile.userId)).resolves.toBeNull();
  });

  it("scopes the profile lookup to the requesting user", async () => {
    let requestedUserId: string | undefined;
    const service = new OnboardingService(
      repository({
        findForUser: async (userId) => {
          requestedUserId = userId;
          return baseProfile;
        },
      }),
    );

    const result = await service.getProfile(baseProfile.userId);

    expect(requestedUserId).toBe(baseProfile.userId);
    expect(result).toEqual(baseProfile);
  });

  it("wraps an unexpected repository failure as a persistence-unavailable error", async () => {
    const service = new OnboardingService(
      repository({
        complete: async () => {
          throw new Error("connection reset");
        },
      }),
    );

    await expect(
      service.completeOnboarding(baseProfile.userId, {
        locale: "ar",
        timeZone: "UTC",
        university: null,
        major: null,
      }),
    ).rejects.toMatchObject({ code: "ONBOARDING_PERSISTENCE_UNAVAILABLE" });
  });
});
