import type { UserAccount } from "../../domain/user-account";
import type { ExternalPrincipal } from "./authentication-provider";

export interface UserIdentityRepository {
  resolveOrCreate(principal: ExternalPrincipal): Promise<UserAccount>;
}
