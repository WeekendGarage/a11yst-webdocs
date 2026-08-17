import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { ensureWebsiteBuilt, WEBSITE_DIST } from "../../helpers/website/build.js";

describe("website community claims", () => {
  it("reflects P3b contribution policy", async () => {
    await ensureWebsiteBuilt();
    const contributing = await readFile(
      join(WEBSITE_DIST, "community/contributing/index.html"),
      "utf8",
    );
    expect(contributing).toMatch(/Issues welcome|issues welcome/i);
    expect(contributing).toMatch(/Pull requests welcome|pull requests welcome/i);
    expect(contributing).toMatch(/Documentation PRs welcome|documentation PRs welcome/i);
    expect(contributing).toMatch(/Code PRs welcome|code PRs welcome/i);
    expect(contributing).toMatch(/CLA workflow once active/i);
    expect(contributing).toMatch(/not active/i);
  });

  it("represents MPL-2.0 on the license page", async () => {
    await ensureWebsiteBuilt();
    const license = await readFile(join(WEBSITE_DIST, "community/license/index.html"), "utf8");
    expect(license).toMatch(/MPL-2\.0/);
  });
});
