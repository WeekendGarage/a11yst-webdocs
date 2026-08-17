import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { ensureWebsiteBuilt, WEBSITE_DIST } from "../../helpers/website/build.js";

describe("website privacy foundation", () => {
  it("does not embed analytics, external search, or tracking in built pages", async () => {
    await ensureWebsiteBuilt();
    const pages = ["index.html", "getting-started/index.html", "reference/cli/index.html"];
    for (const page of pages) {
      const html = await readFile(join(WEBSITE_DIST, page), "utf8");
      expect(html).not.toMatch(/algolia|meilisearch|typesense|segment\.com|hotjar|mixpanel/i);
      expect(html).not.toMatch(/googletagmanager|google-analytics|gtag\(/i);
      expect(html).not.toMatch(/fonts\.googleapis\.com/);
    }
  });

  it("uses local static search only", async () => {
    await ensureWebsiteBuilt();
    const home = await readFile(join(WEBSITE_DIST, "index.html"), "utf8");
    expect(home).toMatch(/search\/search_index\.json|"search":/);
    expect(home).not.toMatch(/https:\/\/[^"']+\/search/i);
  });
});
