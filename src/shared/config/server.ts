import { parseServerEnvironment } from "./environment";

export function getServerEnvironment() {
  return parseServerEnvironment({
    DATABASE_URL: process.env.DATABASE_URL,
  });
}
