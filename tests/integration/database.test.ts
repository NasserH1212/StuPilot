// @vitest-environment node

import { randomUUID } from "node:crypto";

import { afterAll, afterEach, describe, expect, it } from "vitest";

import { createPrismaClient } from "@/src/infrastructure/persistence/prisma/create-prisma-client";
import { PrismaFoundationHealthRepository } from "@/src/infrastructure/persistence/prisma/foundation-health-repository";
import { parseTestEnvironment } from "@/src/shared/config/environment";

const configuredUrl = process.env.TEST_DATABASE_URL;
const databaseSuite = configuredUrl ? describe : describe.skip;
const markerPrefix = "sprint-0-integration-";
const client = configuredUrl ? createPrismaClient(configuredUrl) : undefined;

databaseSuite("PostgreSQL and Prisma compatibility", () => {
  afterEach(async () => {
    await client?.foundationHealthCheck.deleteMany({
      where: { marker: { startsWith: markerPrefix } },
    });
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
});
