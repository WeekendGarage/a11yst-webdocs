import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { ensureWebsiteBuilt, WEBSITE_DIST } from "../../helpers/website/build.js";

describe("website metadata foundation", () => {
  it("sets home and docs titles", async () => {
    await ensureWebsiteBuilt();
    const home = await readFile(join(WEBSITE_DIST, "index.html"), "utf8");
    const docs = await readFile(join(WEBSITE_DIST, "getting-started/index.html"), "utf8");
    expect(home).toMatch(/<title[^>]*>a11yst: Your accessibility analyst\.<\/title>/);
    expect(docs).toMatch(/<title[^>]*>Getting Started \| a11yst<\/title>/);
  });

  it("includes description, favicon, and language foundation", async () => {
    await ensureWebsiteBuilt();
    const home = await readFile(join(WEBSITE_DIST, "index.html"), "utf8");
    expect(home).toMatch(/<html[^>]*lang="en"/);
    expect(home).toContain('name="description"');
    expect(home).toContain('rel="icon"');
    expect(home).toContain("favicon.svg");
    expect(home).not.toMatch(/https:\/\/example\.com/);
  });

  it("includes skip link and main landmark on home", async () => {
    await ensureWebsiteBuilt();
    const home = await readFile(join(WEBSITE_DIST, "index.html"), "utf8");
    expect(home).toMatch(/Skip to content/i);
    expect(home).toMatch(/<main[^>]+data-md-component="main"/);
  });
});
