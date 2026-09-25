export interface TermRecord {
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

export interface NewTerm {
  readonly userId: string;
  readonly name: string;
  readonly startsOn: Date;
  readonly endsOn: Date;
  readonly timeZone: string;
  readonly isActive: boolean;
}

export interface TermEdit {
  readonly name: string;
  readonly startsOn: Date;
  readonly endsOn: Date;
  readonly timeZone: string;
}

export interface TermRepository {
  create(term: NewTerm): Promise<TermRecord>;
  listForUser(userId: string): Promise<readonly TermRecord[]>;
  findForUser(id: string, userId: string): Promise<TermRecord | null>;
  update(
    id: string,
    userId: string,
    edit: TermEdit,
    expectedVersion: number,
  ): Promise<TermRecord>;
  archive(id: string, userId: string, expectedVersion: number): Promise<TermRecord>;
  activate(id: string, userId: string, expectedVersion: number): Promise<TermRecord>;
}
