// @vitest-environment node

import { randomUUID } from "node:crypto";

import { afterAll, afterEach, describe, expect, it } from "vitest";

import { createPrismaClient } from "@/src/infrastructure/persistence/prisma/create-prisma-client";
import { PrismaFoundationHealthRepository } from "@/src/infrastructure/persistence/prisma/foundation-health-repository";
import { PrismaUserIdentityRepository } from "@/src/infrastructure/persistence/prisma/prisma-user-identity-repository";
import { parseTestEnvironment } from "@/src/shared/config/environment";

const configuredUrl = process.env.TEST_DATABASE_URL;
const databaseSuite = configuredUrl ? describe : describe.skip;
const markerPrefix = "sprint-0-integration-";
const identityProviderPrefix = "studenthub-integration-";
const client = configuredUrl ? createPrismaClient(configuredUrl) : undefined;

databaseSuite("PostgreSQL and Prisma compatibility", () => {
  afterEach(async () => {
    await client?.foundationHealthCheck.deleteMany({
      where: { marker: { startsWith: markerPrefix } },
    });
    const identities = await client?.authIdentity.findMany({
      where: { provider: { startsWith: identityProviderPrefix } },
      select: { userId: true },
    });
    const userIds = [...new Set(identities?.map((identity) => identity.userId) ?? [])];
    await client?.authIdentity.deleteMany({
      where: { provider: { startsWith: identityProviderPrefix } },
    });
    if (userIds.length > 0) {
      await client?.user.deleteMany({ where: { id: { in: userIds } } });
    }
  });

  afterAll(async () => {
    await client?.$disconnect();
  });

  it("connects to real PostgreSQL and observes the reviewed migration", async () => {
    if (!client) throw new Error("Test client is not configured.");
    const environment = parseTestEnvironment({ TEST_DATABASE_URL: configuredUrl });
    expect(environment.TEST_DATABASE_URL).toBe(configuredUrl);

    const connection = await client.$queryRaw<
      Array<{ connected: number }>
    >`SELECT 1 AS connected`;
    const relation = await client.$queryRaw<Array<{ table_name: string | null }>>`
      SELECT to_regclass('public._foundation_health_checks')::text AS table_name
    `;
    const migration = await client.$queryRaw<
      Array<{ migration_name: string; finished_at: Date | null }>
    >`
      SELECT migration_name, finished_at
      FROM _prisma_migrations
      WHERE migration_name = '20260807000000_foundation_health_check'
    `;

    expect(connection).toEqual([{ connected: 1 }]);
    expect(relation[0]?.table_name).toBe("_foundation_health_checks");
    expect(migration[0]?.finished_at).toBeInstanceOf(Date);

    const identityMigration = await client.$queryRaw<
      Array<{ migration_name: string; finished_at: Date | null }>
    >`
      SELECT migration_name, finished_at
      FROM _prisma_migrations
      WHERE migration_name = '20260809090000_production_identity_foundation'
    `;
    expect(identityMigration[0]?.finished_at).toBeInstanceOf(Date);
  });

  it("uses the generated client through an application-owned repository interface", async () => {
    if (!client) throw new Error("Test client is not configured.");
    const repository = new PrismaFoundationHealthRepository(client);
    const record = await repository.createInTransaction();

    expect(record.id).toMatch(/^[0-9a-f-]{36}$/i);
    await repository.deleteById(record.id);
  });

  it("rolls a failed transaction back", async () => {
    if (!client) throw new Error("Test client is not configured.");
    const id = randomUUID();
    const marker = `${markerPrefix}${id}`;

    await expect(
      client.$transaction(async (transaction) => {
        await transaction.foundationHealthCheck.create({ data: { id, marker } });
        throw new Error("intentional rollback proof");
      }),
    ).rejects.toThrow("intentional rollback proof");

    await expect(
      client.foundationHealthCheck.findUnique({ where: { id } }),
    ).resolves.toBeNull();
  });

  it("keeps test data isolated with deterministic cleanup", async () => {
    if (!client) throw new Error("Test client is not configured.");
    const marker = `${markerPrefix}${randomUUID()}`;
    await client.foundationHealthCheck.create({ data: { marker } });

    expect(
      await client.foundationHealthCheck.count({
        where: { marker: { startsWith: markerPrefix } },
      }),
    ).toBeGreaterThan(0);
  });

  it("creates one internal UUID for concurrent first-login attempts", async () => {
    if (!client) throw new Error("Test client is not configured.");
    const repository = new PrismaUserIdentityRepository(client);
    const provider = `${identityProviderPrefix}${randomUUID()}`;
    const principal = {
      providerKey: provider,
      providerSubject: "same-opaque-subject",
      verifiedEmailSnapshot: "synthetic@example.test",
      emailVerifiedAt: new Date("2026-08-09T00:00:00.000Z"),
    };

    const accounts = await Promise.all(
      Array.from({ length: 4 }, () => repository.resolveOrCreate(principal)),
    );
    expect(new Set(accounts.map((account) => account.id)).size).toBe(1);
    expect(
      await client.authIdentity.count({
        where: { provider, providerSubject: principal.providerSubject },
      }),
    ).toBe(1);
  });

  it("never merges different provider subjects by verified email", async () => {
    if (!client) throw new Error("Test client is not configured.");
    const repository = new PrismaUserIdentityRepository(client);
    const provider = `${identityProviderPrefix}${randomUUID()}`;
    const common = {
      providerKey: provider,
      verifiedEmailSnapshot: "same-synthetic@example.test",
      emailVerifiedAt: new Date("2026-08-09T00:00:00.000Z"),
    };

    const first = await repository.resolveOrCreate({
      ...common,
      providerSubject: "opaque-subject-one",
    });
    const second = await repository.resolveOrCreate({
      ...common,
      providerSubject: "opaque-subject-two",
    });

    expect(first.id).not.toBe(second.id);
  });
});
