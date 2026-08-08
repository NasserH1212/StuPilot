import { parsePublicEnvironment } from "./environment";

// Only explicit NEXT_PUBLIC_* names may be referenced in this client-safe module.
export function getPublicEnvironment() {
  return parsePublicEnvironment({
    NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV,
  });
}
