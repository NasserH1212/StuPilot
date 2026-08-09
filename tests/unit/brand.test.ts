import { describe, expect, it } from "vitest";

import { publicBrand } from "@/src/shared/config/brand";

describe("public brand configuration", () => {
  it("defines the approved product name and purchased primary domain", () => {
    expect(publicBrand).toEqual({
      productName: "StuPilot",
      primaryDomain: "stupilot.com",
    });
  });
});
