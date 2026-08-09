import {
  AccountUnavailableError,
  requireActiveAccount,
  type UserAccount,
} from "../domain/user-account";
import { AuthenticationError, isAuthenticationError } from "./authentication-error";
import type {
  AuthenticationLinkIntent,
  AuthenticationProvider,
  ExternalPrincipal,
  PasswordRecoveryRequest,
  RegistrationRequest,
  SignInRequest,
} from "./ports/authentication-provider";
import type { UserIdentityRepository } from "./ports/user-identity-repository";

export interface CompletedAuthenticationLink {
  readonly account: UserAccount;
  readonly principal: ExternalPrincipal;
  readonly intent: AuthenticationLinkIntent;
}

export interface AuthenticatedSession {
  readonly account: UserAccount;
  readonly principal: ExternalPrincipal;
}

export class AuthenticationService {
  public constructor(
    private readonly provider: AuthenticationProvider,
    private readonly identities: UserIdentityRepository,
  ) {}

  public async register(request: RegistrationRequest): Promise<void> {
    await this.provider.register(request);
  }

  public async signIn(request: SignInRequest): Promise<UserAccount> {
    const principal = await this.provider.signIn(request);
    return this.establishInternalAccount(principal, true);
  }

  public async completeLink(
    tokenHash: string,
    intent: AuthenticationLinkIntent,
  ): Promise<CompletedAuthenticationLink> {
    const principal = await this.provider.verifyLink(tokenHash, intent);
    const account = await this.establishInternalAccount(principal, true);
    return { account, principal, intent };
  }

  public async currentAccount(): Promise<UserAccount | null> {
    return (await this.currentSession())?.account ?? null;
  }

  public async currentSession(): Promise<AuthenticatedSession | null> {
    const principal = await this.provider.getCurrentPrincipal();
    if (!principal) return null;
    const account = await this.establishInternalAccount(principal, false);
    return { account, principal };
  }

  public async requestPasswordRecovery(
    request: PasswordRecoveryRequest,
  ): Promise<void> {
    await this.provider.requestPasswordRecovery(request);
  }

  public async updatePassword(password: string): Promise<void> {
    await this.provider.updatePassword(password);
  }

  public async signOut(): Promise<void> {
    await this.provider.signOut();
  }

  private async establishInternalAccount(
    principal: ExternalPrincipal,
    clearProviderSessionOnFailure: boolean,
  ): Promise<UserAccount> {
    try {
      return requireActiveAccount(await this.identities.resolveOrCreate(principal));
    } catch (error) {
      if (clearProviderSessionOnFailure) {
        try {
          await this.provider.signOut();
        } catch {
          // The original fail-closed identity error remains authoritative.
        }
      }

      if (error instanceof AccountUnavailableError) {
        throw new AuthenticationError(
          "ACCOUNT_UNAVAILABLE",
          "The internal account is not active.",
          { cause: error },
        );
      }

      if (isAuthenticationError(error)) throw error;

      throw new AuthenticationError(
        "PROVIDER_UNAVAILABLE",
        "The identity store could not establish an internal account.",
        { cause: error },
      );
    }
  }
}
