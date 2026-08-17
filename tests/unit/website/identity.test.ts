import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { ensureWebsiteBuilt, WEBSITE_DIST } from "../../helpers/website/build.js";

describe("website identity", () => {
  it("renders canonical identity on the home page build output", async () => {
    await ensureWebsiteBuilt();
    const home = await readFile(join(WEBSITE_DIST, "index.html"), "utf8");
    expect(home).toContain("a11yst");
    expect(home).toContain("Your accessibility analyst.");
    expect(home).not.toMatch(/\bAlly\b/);
    expect(home).not.toContain("Always by your side.");
  });

  it("does not claim unsupported product capabilities in docs build output", async () => {
    await ensureWebsiteBuilt();
    const docs = await readFile(join(WEBSITE_DIST, "getting-started/index.html"), "utf8");
    expect(docs).not.toMatch(/WCAG certification|full WCAG compliance|React Native supported/i);
    expect(docs).toMatch(/Automated checks do not establish accessibility conformance/i);
  });
});
