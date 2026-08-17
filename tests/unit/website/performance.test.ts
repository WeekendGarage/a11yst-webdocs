import { readFile, stat } from "node:fs/promises";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  ensureWebsiteBuilt,
  listBuiltHtmlFiles,
  PERFORMANCE_BUDGETS,
  routePathFromHtmlFile,
  WEBSITE_DIR,
  WEBSITE_DIST,
} from "../../helpers/website/build.js";

describe("website performance inventory", () => {
  it("keeps custom home assets within practical budgets", async () => {
    const homeJs = await stat(join(WEBSITE_DIR, "docs/javascripts/home.js"));
    const homeCss = await stat(join(WEBSITE_DIR, "docs/stylesheets/home.css"));
    const fixesJs = await stat(join(WEBSITE_DIR, "docs/javascripts/a11y-fixes.js"));
    expect(homeJs.size).toBeLessThanOrEqual(PERFORMANCE_BUDGETS.customHomeJsBytes);
    expect(homeCss.size).toBeLessThanOrEqual(PERFORMANCE_BUDGETS.customHomeCssBytes);
    expect(fixesJs.size).toBeLessThanOrEqual(PERFORMANCE_BUDGETS.customA11yFixesJsBytes);
  });

  it("keeps generated HTML and search index within practical budgets", async () => {
    await ensureWebsiteBuilt();
    const homeHtml = await stat(join(WEBSITE_DIST, "index.html"));
    expect(homeHtml.size).toBeLessThanOrEqual(PERFORMANCE_BUDGETS.homeHtmlBytes);

    const htmlFiles = await listBuiltHtmlFiles();
    let largestDocs = 0;
    for (const file of htmlFiles) {
      if (routePathFromHtmlFile(file) === "/") continue;
      const info = await stat(file);
      largestDocs = Math.max(largestDocs, info.size);
    }
    expect(largestDocs).toBeLessThanOrEqual(PERFORMANCE_BUDGETS.largestDocsHtmlBytes);

    const searchIndex = await stat(join(WEBSITE_DIST, "search/search_index.json"));
    expect(searchIndex.size).toBeLessThanOrEqual(PERFORMANCE_BUDGETS.searchIndexBytes);
  });

  it("does not load external runtime fonts or analytics in built HTML", async () => {
    await ensureWebsiteBuilt();
    const home = await readFile(join(WEBSITE_DIST, "index.html"), "utf8");
    const docs = await readFile(join(WEBSITE_DIST, "getting-started/index.html"), "utf8");
    for (const html of [home, docs]) {
      expect(html).not.toMatch(/fonts\.googleapis\.com|fonts\.gstatic\.com/);
      expect(html).not.toMatch(/googletagmanager|google-analytics|plausible|segment\.com/i);
    }
  });
});
