import { z } from "zod";

import { ApplicationError } from "../errors/application-error";

const applicationEnvironmentSchema = z.enum(["local", "test", "preview", "production"]);

const postgresUrlSchema = z
  .string()
  .min(1)
  .superRefine((value, context) => {
    try {
      const url = new URL(value);
      if (url.protocol !== "postgresql:" && url.protocol !== "postgres:") {
        context.addIssue({
          code: "custom",
          message: "must use the postgresql protocol",
        });
      }
      if (url.pathname.length <= 1) {
        context.addIssue({ code: "custom", message: "must name a database" });
      }
    } catch {
      context.addIssue({ code: "custom", message: "must be a valid PostgreSQL URL" });
    }
  });

const publicEnvironmentSchema = z.object({
  NEXT_PUBLIC_APP_ENV: applicationEnvironmentSchema.default("local"),
  NEXT_PUBLIC_SUPABASE_URL: z.url().optional(),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(20).optional(),
});

const serverEnvironmentSchema = z.object({
  DATABASE_URL: postgresUrlSchema,
});

const authenticationEnvironmentSchema = z
  .object({
    AUTH_APP_ORIGIN: z.url(),
    AUTH_STATE_SECRET: z.string().min(32),
    DATABASE_URL: postgresUrlSchema,
    NEXT_PUBLIC_SUPABASE_URL: z.url(),
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(20),
  })
  .superRefine((value, context) => {
    const origin = new URL(value.AUTH_APP_ORIGIN);
    const isLoopback = ["localhost", "127.0.0.1", "[::1]"].includes(origin.hostname);

    if (origin.pathname !== "/" || origin.search || origin.hash) {
      context.addIssue({
        code: "custom",
        path: ["AUTH_APP_ORIGIN"],
        message: "must be an origin without a path, query, or fragment",
      });
    }

    if (origin.protocol !== "https:" && !(isLoopback && origin.protocol === "http:")) {
      context.addIssue({
        code: "custom",
        path: ["AUTH_APP_ORIGIN"],
        message: "must use HTTPS except for a loopback local environment",
      });
    }
  });

const testEnvironmentSchema = z
  .object({
    TEST_DATABASE_URL: postgresUrlSchema,
    DATABASE_URL: postgresUrlSchema.optional(),
  })
  .superRefine((value, context) => {
    const testUrl = new URL(value.TEST_DATABASE_URL);
    const databaseName = testUrl.pathname.slice(1).toLowerCase();

    if (!databaseName.includes("test")) {
      context.addIssue({
        code: "custom",
        path: ["TEST_DATABASE_URL"],
        message: "must identify a dedicated test database",
      });
    }

    if (value.DATABASE_URL && value.DATABASE_URL === value.TEST_DATABASE_URL) {
      context.addIssue({
        code: "custom",
        path: ["TEST_DATABASE_URL"],
        message: "must differ from DATABASE_URL",
      });
    }
  });

export type PublicEnvironment = z.infer<typeof publicEnvironmentSchema>;
export type ServerEnvironment = z.infer<typeof serverEnvironmentSchema>;
export type TestEnvironment = z.infer<typeof testEnvironmentSchema>;
export type AuthenticationEnvironment = z.infer<typeof authenticationEnvironmentSchema>;

function parseEnvironment<T>(schema: z.ZodType<T>, value: unknown, scope: string): T {
  const result = schema.safeParse(value);

  if (!result.success) {
    const fields = result.error.issues
      .map((issue) => `${issue.path.join(".") || "configuration"}: ${issue.message}`)
      .join("; ");

    throw new ApplicationError(
      "INVALID_ENVIRONMENT",
      `Invalid ${scope} environment configuration (${fields}).`,
    );
  }

  return result.data;
}

export function parsePublicEnvironment(value: unknown): PublicEnvironment {
  return parseEnvironment(publicEnvironmentSchema, value, "public");
}

export function parseServerEnvironment(value: unknown): ServerEnvironment {
  return parseEnvironment(serverEnvironmentSchema, value, "server");
}

export function parseTestEnvironment(value: unknown): TestEnvironment {
  return parseEnvironment(testEnvironmentSchema, value, "test");
}

export function parseAuthenticationEnvironment(
  value: unknown,
): AuthenticationEnvironment {
  return parseEnvironment(authenticationEnvironmentSchema, value, "authentication");
}
