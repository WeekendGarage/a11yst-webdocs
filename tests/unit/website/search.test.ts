import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { ensureWebsiteBuilt, WEBSITE_DIST } from "../../helpers/website/build.js";

const SEARCH_INDEX_CANDIDATES = [
  join(WEBSITE_DIST, "search/search_index.json"),
  join(WEBSITE_DIST, "assets/javascripts/workers/search.f886a092.min.js"),
] as const;

describe("website search", () => {
  it("generates a static search index in the build output", async () => {
    await ensureWebsiteBuilt();
    const indexPath = join(WEBSITE_DIST, "search/search_index.json");
    const indexRaw = await readFile(indexPath, "utf8");
    const index = JSON.parse(indexRaw) as { docs?: Array<{ text?: string; title?: string }> };
    expect(index.docs?.length ?? 0).toBeGreaterThan(0);
  });

  it("indexes foundation documentation terms", async () => {
    await ensureWebsiteBuilt();
    const indexRaw = await readFile(join(WEBSITE_DIST, "search/search_index.json"), "utf8");
    const corpus = indexRaw.toLowerCase();
    for (const term of [
      "baseline",
      "route",
      "keyboard",
      "sarif",
      "source mapping",
      "exit code",
      "policy",
      "configuration",
      "troubleshooting",
      "next.js",
    ]) {
      expect(corpus, `missing indexed term: ${term}`).toContain(term);
    }
  });

  it("includes search UI in built HTML without external provider references", async () => {
    await ensureWebsiteBuilt();
    const home = await readFile(join(WEBSITE_DIST, "index.html"), "utf8");
    expect(home).toMatch(/search/i);
    expect(home).not.toMatch(/algolia|meilisearch|typesense|elastic/i);
    let indexFound = false;
    for (const candidate of SEARCH_INDEX_CANDIDATES) {
      try {
        await readFile(candidate, "utf8");
        indexFound = true;
        break;
      } catch {
        // try next candidate
      }
    }
    expect(indexFound).toBe(true);
  });
});
