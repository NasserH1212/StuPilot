import { describe, expect, it } from "vitest";

import { AuthenticationService } from "@/src/modules/authentication/application/authentication-service";
import { AuthenticationError } from "@/src/modules/authentication/application/authentication-error";
import type {
  AuthenticationProvider,
  ExternalPrincipal,
} from "@/src/modules/authentication/application/ports/authentication-provider";
import type { UserIdentityRepository } from "@/src/modules/authentication/application/ports/user-identity-repository";

const principal: ExternalPrincipal = {
  providerKey: "provider-under-test",
  providerSubject: "subject-123",
  verifiedEmailSnapshot: "student@example.test",
  emailVerifiedAt: new Date("2026-08-09T00:00:00.000Z"),
};

function provider(
  overrides: Partial<AuthenticationProvider> = {},
): AuthenticationProvider {
  return {
    register: async () => undefined,
    signIn: async () => principal,
    verifyLink: async () => principal,
    getCurrentPrincipal: async () => principal,
    requestPasswordRecovery: async () => undefined,
    updatePassword: async () => undefined,
    signOut: async () => undefined,
    ...overrides,
  };
}

describe("application-owned authentication orchestration", () => {
  it("resolves provider identity to the internal user ID", async () => {
    const identities: UserIdentityRepository = {
      resolveOrCreate: async (received) => {
        expect(received).toEqual(principal);
        return { id: "018f57b5-f220-7d84-bafd-4d975e550001", state: "active" };
      },
    };
    const service = new AuthenticationService(provider(), identities);

    await expect(
      service.signIn({ email: "student@example.test", password: "not-recorded" }),
    ).resolves.toEqual({
      id: "018f57b5-f220-7d84-bafd-4d975e550001",
      state: "active",
    });
  });

  it("fails closed for disabled internal accounts", async () => {
    const identities: UserIdentityRepository = {
      resolveOrCreate: async () => ({
        id: "018f57b5-f220-7d84-bafd-4d975e550002",
        state: "disabled",
      }),
    };
    const service = new AuthenticationService(provider(), identities);

    await expect(service.currentAccount()).rejects.toMatchObject({
      code: "ACCOUNT_UNAVAILABLE",
    });
  });

  it("clears a newly established provider session when identity creation fails", async () => {
    let signedOut = false;
    const identities: UserIdentityRepository = {
      resolveOrCreate: async () => {
        throw new Error("database unavailable");
      },
    };
    const service = new AuthenticationService(
      provider({
        signOut: async () => {
          signedOut = true;
        },
      }),
      identities,
    );

    await expect(
      service.signIn({ email: "student@example.test", password: "not-recorded" }),
    ).rejects.toBeInstanceOf(AuthenticationError);
    expect(signedOut).toBe(true);
  });
});
