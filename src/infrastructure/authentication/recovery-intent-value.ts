import { createHash, createHmac, timingSafeEqual } from "node:crypto";

export const recoveryIntentLifetimeSeconds = 10 * 60;

function subjectFingerprint(subject: string): string {
  return createHash("sha256").update(subject, "utf8").digest("base64url");
}

function signature(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload, "utf8").digest("base64url");
}

export function createRecoveryIntentValue(
  subject: string,
  secret: string,
  now = Date.now(),
): string {
  const expiresAt = Math.floor(now / 1000) + recoveryIntentLifetimeSeconds;
  const payload = `${expiresAt}.${subjectFingerprint(subject)}`;
  return `${payload}.${signature(payload, secret)}`;
}

export function verifyRecoveryIntentValue(
  value: string | undefined,
  subject: string,
  secret: string,
  now = Date.now(),
): boolean {
  if (!value) return false;
  const segments = value.split(".");
  if (segments.length !== 3) return false;

  const [expiresAtValue, fingerprint, suppliedSignature] = segments;
  if (!expiresAtValue || !fingerprint || !suppliedSignature) return false;
  const expiresAt = Number(expiresAtValue);
  if (!Number.isSafeInteger(expiresAt) || expiresAt < Math.floor(now / 1000)) {
    return false;
  }

  if (fingerprint !== subjectFingerprint(subject)) return false;
  const payload = `${expiresAtValue}.${fingerprint}`;
  const expected = Buffer.from(signature(payload, secret), "base64url");
  const supplied = Buffer.from(suppliedSignature, "base64url");
  return expected.length === supplied.length && timingSafeEqual(expected, supplied);
}
