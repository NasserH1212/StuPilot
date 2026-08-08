export interface FoundationHealthRecord {
  readonly id: string;
  readonly checkedAt: Date;
}

export interface FoundationHealthRepository {
  createInTransaction(): Promise<FoundationHealthRecord>;
  deleteById(id: string): Promise<void>;
}
