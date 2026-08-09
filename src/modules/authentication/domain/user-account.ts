export const accountStates = ["active", "disabled", "deletion_pending"] as const;

export type AccountState = (typeof accountStates)[number];

export interface UserAccount {
  readonly id: string;
  readonly state: AccountState;
}

export class AccountUnavailableError extends Error {
  public constructor(public readonly state: Exclude<AccountState, "active">) {
    super("The internal user account is not available for authentication.");
    this.name = "AccountUnavailableError";
  }
}

export function requireActiveAccount(account: UserAccount): UserAccount {
  if (account.state !== "active") {
    throw new AccountUnavailableError(account.state);
  }

  return account;
}
