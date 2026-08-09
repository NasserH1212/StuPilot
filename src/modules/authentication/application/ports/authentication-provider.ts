export type AuthenticationLinkIntent = "email_verification" | "password_recovery";

export interface ExternalPrincipal {
  readonly providerKey: string;
  readonly providerSubject: string;
  readonly verifiedEmailSnapshot?: string;
  readonly emailVerifiedAt: Date;
}

export interface RegistrationRequest {
  readonly email: string;
  readonly password: string;
  readonly verificationCallbackUrl: string;
}

export interface SignInRequest {
  readonly email: string;
  readonly password: string;
}

export interface PasswordRecoveryRequest {
  readonly email: string;
  readonly recoveryCallbackUrl: string;
}

export interface AuthenticationProvider {
  register(request: RegistrationRequest): Promise<void>;
  signIn(request: SignInRequest): Promise<ExternalPrincipal>;
  verifyLink(
    tokenHash: string,
    intent: AuthenticationLinkIntent,
  ): Promise<ExternalPrincipal>;
  getCurrentPrincipal(): Promise<ExternalPrincipal | null>;
  requestPasswordRecovery(request: PasswordRecoveryRequest): Promise<void>;
  updatePassword(password: string): Promise<void>;
  signOut(): Promise<void>;
}
