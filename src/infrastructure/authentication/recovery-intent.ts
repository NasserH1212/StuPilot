import "server-only";

import { cookies } from "next/headers";

import type { AuthenticationEnvironment } from "@/src/shared/config/environment";

import {
  createRecoveryIntentValue,
  recoveryIntentLifetimeSeconds,
  verifyRecoveryIntentValue,
} from "./recovery-intent-value";

const recoveryCookieName = "studenthub.auth.recovery";

export async function setRecoveryIntent(
  environment: AuthenticationEnvironment,
  subject: string,
): Promise<void> {
  const secure = new URL(environment.AUTH_APP_ORIGIN).protocol === "https:";
  (await cookies()).set(
    recoveryCookieName,
    createRecoveryIntentValue(subject, environment.AUTH_STATE_SECRET),
    {
      httpOnly: true,
      maxAge: recoveryIntentLifetimeSeconds,
      path: "/",
      sameSite: "strict",
      secure,
    },
  );
}

export async function hasRecoveryIntent(
  environment: AuthenticationEnvironment,
  subject: string,
): Promise<boolean> {
  const value = (await cookies()).get(recoveryCookieName)?.value;
  return verifyRecoveryIntentValue(value, subject, environment.AUTH_STATE_SECRET);
}

export async function clearRecoveryIntent(
  environment: AuthenticationEnvironment,
): Promise<void> {
  const secure = new URL(environment.AUTH_APP_ORIGIN).protocol === "https:";
  (await cookies()).set(recoveryCookieName, "", {
    httpOnly: true,
    maxAge: 0,
    path: "/",
    sameSite: "strict",
    secure,
  });
}

export { createRecoveryIntentValue, verifyRecoveryIntentValue };
