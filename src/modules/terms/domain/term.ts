export interface Term {
  readonly id: string;
  readonly userId: string;
  readonly name: string;
  readonly startsOn: Date;
  readonly endsOn: Date;
  readonly timeZone: string;
  readonly isActive: boolean;
  readonly archivedAt: Date | null;
  readonly version: number;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface TermDates {
  readonly name: string;
  readonly startsOn: Date;
  readonly endsOn: Date;
  readonly timeZone: string;
}

export interface TermDraft extends TermDates {
  readonly isActive: boolean;
}

export const termInvariantCodes = ["NAME_REQUIRED", "DATE_ORDER"] as const;

export type TermInvariantCode = (typeof termInvariantCodes)[number];

export class TermInvariantError extends Error {
  public constructor(public readonly invariant: TermInvariantCode) {
    super(`The academic term violates the ${invariant} invariant.`);
    this.name = "TermInvariantError";
  }
}

export function assertTermDraft<T extends TermDates>(draft: T): T {
  if (draft.name.trim().length === 0) {
    throw new TermInvariantError("NAME_REQUIRED");
  }

  if (draft.endsOn.getTime() < draft.startsOn.getTime()) {
    throw new TermInvariantError("DATE_ORDER");
  }

  return draft;
}
