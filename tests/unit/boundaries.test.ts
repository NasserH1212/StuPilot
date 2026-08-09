import path from "node:path";

import { describe, expect, it } from "vitest";

// @ts-expect-error The executable ESM boundary checker intentionally has no declaration package.
import * as boundaryChecker from "../../scripts/check-boundaries.mjs";

const { boundaryViolations, checkRepositoryBoundaries } = boundaryChecker;

describe("architecture boundaries", () => {
  it("finds no prohibited imports in the repository", async () => {
    await expect(checkRepositoryBoundaries(process.cwd())).resolves.toEqual([]);
  });

  it("rejects framework imports from domain code", () => {
    const importer = path.join(
      process.cwd(),
      "src/modules/example/domain/example-policy.ts",
    );
    expect(boundaryViolations(process.cwd(), importer, ["next/navigation"])).toEqual([
      expect.stringContaining("domain cannot depend on framework or infrastructure"),
    ]);
  });

  it("rejects any import from the disposable research prototype", () => {
    const importer = path.join(
      process.cwd(),
      "src/modules/example/presentation/example-view.tsx",
    );
    expect(
      boundaryViolations(process.cwd(), importer, ["@/research-prototype/app.js"]),
    ).toEqual([expect.stringContaining("research prototype is prohibited")]);
  });

  it("rejects authentication provider SDK imports outside infrastructure", () => {
    const importer = path.join(
      process.cwd(),
      "src/modules/authentication/application/authenticate-user.ts",
    );
    expect(
      boundaryViolations(process.cwd(), importer, ["@supabase/supabase-js"]),
    ).toEqual([
      expect.stringContaining(
        "authentication provider SDKs belong only in infrastructure",
      ),
    ]);
  });
});
