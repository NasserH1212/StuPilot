import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

vi.mock("@/src/composition/authentication", () => ({
  createAuthenticationRuntime: vi.fn(),
}));

vi.mock("@/src/composition/terms", () => ({
  createTermService: vi.fn(),
}));

import { createAuthenticationRuntime } from "@/src/composition/authentication";
import { createTermService } from "@/src/composition/terms";
import { TermError } from "@/src/modules/terms/application/term-error";
import {
  activateTermAction,
  archiveTermAction,
  createTermAction,
  editTermAction,
} from "@/src/modules/terms/transport/term-actions";

const termId = "018f57b5-f220-7d84-bafd-4d975e550100";
const userId = "018f57b5-f220-7d84-bafd-4d975e550001";

function form(fields: Record<string, string>): FormData {
  const data = new FormData();
  for (const [key, value] of Object.entries(fields)) data.set(key, value);
  return data;
}

function fakeService(overrides: Record<string, unknown> = {}) {
  return {
    listTerms: vi.fn(),
    createTerm: vi.fn(),
    editTerm: vi.fn(),
    archiveTerm: vi.fn(),
    activateTerm: vi.fn(),
    ...overrides,
  };
}

function mockAvailableAccount(): void {
  vi.mocked(createAuthenticationRuntime).mockResolvedValue({
    available: true,
    service: { currentAccount: vi.fn().mockResolvedValue({ id: userId }) },
  } as never);
}

function mockUnavailableAuthentication(): void {
  vi.mocked(createAuthenticationRuntime).mockResolvedValue({
    available: false,
  } as never);
}

describe("academic term server actions", () => {
  beforeEach(() => {
    vi.mocked(createAuthenticationRuntime).mockReset();
    vi.mocked(createTermService).mockReset();
  });

  describe("createTermAction", () => {
    it("rejects an incomplete submission before touching authentication", async () => {
      const result = await createTermAction(
        { status: "idle" },
        form({ locale: "en", name: "", startsOn: "", endsOn: "", timeZone: "" }),
      );

      expect(result).toMatchObject({ status: "error", code: "VALIDATION_ERROR" });
      expect(createAuthenticationRuntime).not.toHaveBeenCalled();
    });

    it("rejects an end date before the start date", async () => {
      const result = await createTermAction(
        { status: "idle" },
        form({
          locale: "en",
          name: "Fall 2026",
          startsOn: "2026-12-31",
          endsOn: "2026-09-01",
          timeZone: "Asia/Riyadh",
        }),
      );

      expect(result).toMatchObject({
        status: "error",
        code: "VALIDATION_ERROR",
        fieldErrors: { endsOn: true },
      });
    });

    it("reports the service as unavailable when authentication cannot be reached", async () => {
      mockUnavailableAuthentication();

      const result = await createTermAction(
        { status: "idle" },
        form({
          locale: "en",
          name: "Fall 2026",
          startsOn: "2026-09-01",
          endsOn: "2026-12-31",
          timeZone: "Asia/Riyadh",
        }),
      );

      expect(result).toEqual({ status: "error", code: "UNAVAILABLE" });
      expect(createTermService).not.toHaveBeenCalled();
    });

    it("creates the term for the current account and reports success", async () => {
      mockAvailableAccount();
      const service = fakeService();
      vi.mocked(createTermService).mockReturnValue(service as never);

      const result = await createTermAction(
        { status: "idle" },
        form({
          locale: "en",
          name: "  Fall 2026  ",
          startsOn: "2026-09-01",
          endsOn: "2026-12-31",
          timeZone: "Asia/Riyadh",
          isActive: "on",
        }),
      );

      expect(service.createTerm).toHaveBeenCalledWith(userId, {
        name: "Fall 2026",
        startsOn: new Date("2026-09-01"),
        endsOn: new Date("2026-12-31"),
        timeZone: "Asia/Riyadh",
        isActive: true,
      });
      expect(result).toEqual({ status: "success" });
    });
  });

  describe("editTermAction", () => {
    it("rejects a submission with an invalid term id", async () => {
      const result = await editTermAction(
        { status: "idle" },
        form({
          locale: "en",
          id: "not-a-uuid",
          name: "Fall 2026",
          startsOn: "2026-09-01",
          endsOn: "2026-12-31",
          timeZone: "Asia/Riyadh",
        }),
      );

      expect(result).toMatchObject({ status: "error", code: "VALIDATION_ERROR" });
      expect(createAuthenticationRuntime).not.toHaveBeenCalled();
    });

    it("edits the owned term without touching its active flag", async () => {
      mockAvailableAccount();
      const service = fakeService();
      vi.mocked(createTermService).mockReturnValue(service as never);

      const result = await editTermAction(
        { status: "idle" },
        form({
          locale: "en",
          id: termId,
          name: "Fall 2026 (revised)",
          startsOn: "2026-09-01",
          endsOn: "2026-12-31",
          timeZone: "Asia/Riyadh",
        }),
      );

      expect(service.editTerm).toHaveBeenCalledWith(userId, termId, {
        name: "Fall 2026 (revised)",
        startsOn: new Date("2026-09-01"),
        endsOn: new Date("2026-12-31"),
        timeZone: "Asia/Riyadh",
      });
      expect(result).toEqual({ status: "success" });
    });

    it("maps a not-found service error to the NOT_FOUND action code", async () => {
      mockAvailableAccount();
      const service = fakeService({
        editTerm: vi
          .fn()
          .mockRejectedValue(
            new TermError("TERM_NOT_FOUND", "The academic term was not found."),
          ),
      });
      vi.mocked(createTermService).mockReturnValue(service as never);

      const result = await editTermAction(
        { status: "idle" },
        form({
          locale: "en",
          id: termId,
          name: "Fall 2026",
          startsOn: "2026-09-01",
          endsOn: "2026-12-31",
          timeZone: "Asia/Riyadh",
        }),
      );

      expect(result).toEqual({ status: "error", code: "NOT_FOUND" });
    });

    it("maps a version-conflict service error to the CONFLICT action code", async () => {
      mockAvailableAccount();
      const service = fakeService({
        editTerm: vi
          .fn()
          .mockRejectedValue(
            new TermError(
              "TERM_VERSION_CONFLICT",
              "The academic term changed since it was loaded.",
            ),
          ),
      });
      vi.mocked(createTermService).mockReturnValue(service as never);

      const result = await editTermAction(
        { status: "idle" },
        form({
          locale: "en",
          id: termId,
          name: "Fall 2026",
          startsOn: "2026-09-01",
          endsOn: "2026-12-31",
          timeZone: "Asia/Riyadh",
        }),
      );

      expect(result).toEqual({ status: "error", code: "CONFLICT" });
    });
  });

  describe("archiveTermAction", () => {
    it("rejects a submission missing the term id", async () => {
      const result = await archiveTermAction(
        { status: "idle" },
        form({ locale: "en" }),
      );

      expect(result).toEqual({ status: "error", code: "VALIDATION_ERROR" });
      expect(createAuthenticationRuntime).not.toHaveBeenCalled();
    });

    it("archives the owned term for the current account", async () => {
      mockAvailableAccount();
      const service = fakeService();
      vi.mocked(createTermService).mockReturnValue(service as never);

      const result = await archiveTermAction(
        { status: "idle" },
        form({ locale: "en", id: termId }),
      );

      expect(service.archiveTerm).toHaveBeenCalledWith(userId, termId);
      expect(result).toEqual({ status: "success" });
    });
  });

  describe("activateTermAction", () => {
    it("rejects a submission missing the term id", async () => {
      const result = await activateTermAction(
        { status: "idle" },
        form({ locale: "en" }),
      );

      expect(result).toEqual({ status: "error", code: "VALIDATION_ERROR" });
      expect(createAuthenticationRuntime).not.toHaveBeenCalled();
    });

    it("activates the owned term for the current account", async () => {
      mockAvailableAccount();
      const service = fakeService();
      vi.mocked(createTermService).mockReturnValue(service as never);

      const result = await activateTermAction(
        { status: "idle" },
        form({ locale: "en", id: termId }),
      );

      expect(service.activateTerm).toHaveBeenCalledWith(userId, termId);
      expect(result).toEqual({ status: "success" });
    });

    it("maps an invalid-transition service error to VALIDATION_ERROR", async () => {
      mockAvailableAccount();
      const service = fakeService({
        activateTerm: vi
          .fn()
          .mockRejectedValue(
            new TermError(
              "TERM_INVALID",
              "An archived academic term cannot be activated.",
            ),
          ),
      });
      vi.mocked(createTermService).mockReturnValue(service as never);

      const result = await activateTermAction(
        { status: "idle" },
        form({ locale: "en", id: termId }),
      );

      expect(result).toEqual({ status: "error", code: "VALIDATION_ERROR" });
    });
  });
});
