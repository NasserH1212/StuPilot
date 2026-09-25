import {
  assertTermDraft,
  TermInvariantError,
  type TermDates,
  type TermDraft,
} from "../domain/term";
import { isTermError, TermError } from "./term-error";
import type { TermEdit, TermRecord, TermRepository } from "./ports/term-repository";

export class TermService {
  public constructor(private readonly terms: TermRepository) {}

  public async listTerms(userId: string): Promise<readonly TermRecord[]> {
    try {
      return await this.terms.listForUser(userId);
    } catch (error) {
      throw this.toTermError(error);
    }
  }

  public async createTerm(userId: string, draft: TermDraft): Promise<TermRecord> {
    const normalized = this.normalize(draft);
    try {
      return await this.terms.create({
        userId,
        name: normalized.name,
        startsOn: normalized.startsOn,
        endsOn: normalized.endsOn,
        timeZone: normalized.timeZone,
        isActive: normalized.isActive,
      });
    } catch (error) {
      throw this.toTermError(error);
    }
  }

  public async editTerm(
    userId: string,
    id: string,
    draft: TermDates,
  ): Promise<TermRecord> {
    const normalized = this.normalize(draft);
    const existing = await this.requireOwnedTerm(id, userId);
    const edit: TermEdit = {
      name: normalized.name,
      startsOn: normalized.startsOn,
      endsOn: normalized.endsOn,
      timeZone: normalized.timeZone,
    };

    try {
      return await this.terms.update(id, userId, edit, existing.version);
    } catch (error) {
      throw this.toTermError(error);
    }
  }

  public async archiveTerm(userId: string, id: string): Promise<TermRecord> {
    const existing = await this.requireOwnedTerm(id, userId);
    try {
      return await this.terms.archive(id, userId, existing.version);
    } catch (error) {
      throw this.toTermError(error);
    }
  }

  public async activateTerm(userId: string, id: string): Promise<TermRecord> {
    const existing = await this.requireOwnedTerm(id, userId);
    try {
      return await this.terms.activate(id, userId, existing.version);
    } catch (error) {
      throw this.toTermError(error);
    }
  }

  private normalize<T extends TermDates>(draft: T): T {
    try {
      return assertTermDraft({ ...draft, name: draft.name.trim() });
    } catch (error) {
      if (error instanceof TermInvariantError) {
        throw new TermError("TERM_INVALID", "The academic term is invalid.", {
          cause: error,
        });
      }
      throw this.toTermError(error);
    }
  }

  private async requireOwnedTerm(id: string, userId: string): Promise<TermRecord> {
    let existing: TermRecord | null;
    try {
      existing = await this.terms.findForUser(id, userId);
    } catch (error) {
      throw this.toTermError(error);
    }

    if (!existing) {
      throw new TermError("TERM_NOT_FOUND", "The academic term was not found.");
    }

    return existing;
  }

  private toTermError(error: unknown): TermError {
    if (isTermError(error)) return error;
    return new TermError(
      "TERM_PERSISTENCE_UNAVAILABLE",
      "The academic term store is unavailable.",
      { cause: error },
    );
  }
}
