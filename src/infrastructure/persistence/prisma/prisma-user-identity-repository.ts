import type { ExternalPrincipal } from "@/src/modules/authentication/application/ports/authentication-provider";
import type { UserIdentityRepository } from "@/src/modules/authentication/application/ports/user-identity-repository";
import type { UserAccount } from "@/src/modules/authentication/domain/user-account";

import type { StuPilotPrismaClient } from "./create-prisma-client";

const concurrentRetryLimit = 3;

function hasPrismaCode(error: unknown, code: string): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === code
  );
}

function toAccount(record: {
  readonly id: string;
  readonly state: string;
}): UserAccount {
  if (
    record.state !== "active" &&
    record.state !== "disabled" &&
    record.state !== "deletion_pending"
  ) {
    throw new Error("The persistence adapter returned an unknown account state.");
  }

  return { id: record.id, state: record.state };
}

export class PrismaUserIdentityRepository implements UserIdentityRepository {
  public constructor(private readonly client: StuPilotPrismaClient) {}

  public async resolveOrCreate(principal: ExternalPrincipal): Promise<UserAccount> {
    for (let attempt = 1; attempt <= concurrentRetryLimit; attempt += 1) {
      try {
        return await this.client.$transaction(
          async (transaction) => {
            const existing = await transaction.authIdentity.findUnique({
              where: {
                provider_providerSubject: {
                  provider: principal.providerKey,
                  providerSubject: principal.providerSubject,
                },
              },
              select: { id: true, user: { select: { id: true, state: true } } },
            });

            if (existing) {
              await transaction.authIdentity.update({
                where: { id: existing.id },
                data: {
                  verifiedEmailSnapshot: principal.verifiedEmailSnapshot ?? null,
                  emailVerifiedAt: principal.emailVerifiedAt,
                },
              });
              return toAccount(existing.user);
            }

            const user = await transaction.user.create({
              data: {
                identities: {
                  create: {
                    provider: principal.providerKey,
                    providerSubject: principal.providerSubject,
                    verifiedEmailSnapshot: principal.verifiedEmailSnapshot ?? null,
                    emailVerifiedAt: principal.emailVerifiedAt,
                  },
                },
              },
              select: { id: true, state: true },
            });

            return toAccount(user);
          },
          { isolationLevel: "Serializable" },
        );
      } catch (error) {
        if (hasPrismaCode(error, "P2002")) {
          const winner = await this.findExisting(principal);
          if (winner) return winner;
        }

        if (hasPrismaCode(error, "P2034") && attempt < concurrentRetryLimit) {
          continue;
        }

        throw error;
      }
    }

    throw new Error("The identity transaction retry limit was exhausted.");
  }

  private async findExisting(
    principal: ExternalPrincipal,
  ): Promise<UserAccount | null> {
    const identity = await this.client.authIdentity.findUnique({
      where: {
        provider_providerSubject: {
          provider: principal.providerKey,
          providerSubject: principal.providerSubject,
        },
      },
      select: { user: { select: { id: true, state: true } } },
    });

    return identity ? toAccount(identity.user) : null;
  }
}
