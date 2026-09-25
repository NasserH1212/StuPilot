import { describe, expect, it } from "vitest";

import { TermService } from "@/src/modules/terms/application/term-service";
import type {
  NewTerm,
  TermRecord,
  TermRepository,
} from "@/src/modules/terms/application/ports/term-repository";
import type { TermDraft } from "@/src/modules/terms/domain/term";

const baseRecord: TermRecord = {
  id: "018f57b5-f220-7d84-bafd-4d975e550100",
  userId: "018f57b5-f220-7d84-bafd-4d975e550001",
  name: "Fall 2026",
  startsOn: new Date("2026-09-01T00:00:00.000Z"),
  endsOn: new Date("2026-12-31T00:00:00.000Z"),
  timeZone: "Asia/Riyadh",
  isActive: true,
  archivedAt: null,
  version: 0,
  createdAt: new Date("2026-08-01T00:00:00.000Z"),
  updatedAt: new Date("2026-08-01T00:00:00.000Z"),
};

function validDraft(overrides: Partial<TermDraft> = {}): TermDraft {
  return {
    name: "Fall 2026",
    startsOn: new Date("2026-09-01T00:00:00.000Z"),
    endsOn: new Date("2026-12-31T00:00:00.000Z"),
    timeZone: "Asia/Riyadh",
    isActive: true,
    ...overrides,
  };
}

function repository(overrides: Partial<TermRepository> = {}): TermRepository {
  return {
    create: async () => baseRecord,
    listForUser: async () => [baseRecord],
    findForUser: async () => baseRecord,
    update: async () => baseRecord,
    archive: async () => ({ ...baseRecord, isActive: false, archivedAt: new Date() }),
    activate: async () => baseRecord,
    ...overrides,
  };
}

describe("academic term application service", () => {
  it("trims the name and delegates creation to the repository", async () => {
    let received: NewTerm | undefined;
    const service = new TermService(
      repository({
        create: async (term) => {
          received = term;
          return { ...baseRecord, name: term.name };
        },
      }),
    );

    const result = await service.createTerm(
      baseRecord.userId,
      validDraft({ name: "  Fall 2026  " }),
    );

    expect(received?.name).toBe("Fall 2026");
    expect(received?.userId).toBe(baseRecord.userId);
    expect(result.name).toBe("Fall 2026");
  });

  it("rejects a blank term name as invalid", async () => {
    const service = new TermService(repository());

    await expect(
      service.createTerm(baseRecord.userId, validDraft({ name: "   " })),
    ).rejects.toMatchObject({ code: "TERM_INVALID" });
  });

  it("rejects an end date before the start date", async () => {
    const service = new TermService(repository());

    await expect(
      service.createTerm(
        baseRecord.userId,
        validDraft({
          startsOn: new Date("2026-12-31T00:00:00.000Z"),
          endsOn: new Date("2026-09-01T00:00:00.000Z"),
        }),
      ),
    ).rejects.toMatchObject({ code: "TERM_INVALID" });
  });

  it("reports a missing term as not found when editing", async () => {
    const service = new TermService(repository({ findForUser: async () => null }));

    await expect(
      service.editTerm(baseRecord.userId, baseRecord.id, validDraft()),
    ).rejects.toMatchObject({ code: "TERM_NOT_FOUND" });
  });

  it("scopes listing to the requesting user", async () => {
    let requestedUserId: string | undefined;
    const service = new TermService(
      repository({
        listForUser: async (userId) => {
          requestedUserId = userId;
          return [baseRecord];
        },
      }),
    );

    const result = await service.listTerms(baseRecord.userId);

    expect(requestedUserId).toBe(baseRecord.userId);
    expect(result).toHaveLength(1);
  });
});
