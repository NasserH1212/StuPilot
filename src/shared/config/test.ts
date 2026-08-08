import { parseTestEnvironment } from "./environment";

export function getTestEnvironment() {
  return parseTestEnvironment({
    DATABASE_URL: process.env.DATABASE_URL,
    TEST_DATABASE_URL: process.env.TEST_DATABASE_URL,
  });
}
