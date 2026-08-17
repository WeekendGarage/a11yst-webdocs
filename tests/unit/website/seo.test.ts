import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  ensureWebsiteBuilt,
  KEY_SEO_PAGES,
  listBuiltHtmlFiles,
  routePathFromHtmlFile,
  WEBSITE_DIST,
} from "../../helpers/website/build.js";

async function readBuiltPage(route: string): Promise<string> {
  const suffix = route === "/" ? "index.html" : `${route.replace(/^\//, "")}index.html`;
  return readFile(join(WEBSITE_DIST, suffix), "utf8");
}

describe("website SEO foundation", () => {
  it("gives every public page a meaningful unique title", async () => {
    await ensureWebsiteBuilt();
    const htmlFiles = await listBuiltHtmlFiles();
    const titles: string[] = [];
    for (const file of htmlFiles) {
      const html = await readFile(file, "utf8");
      const match = html.match(/<title>([^<]+)<\/title>/);
      expect(match?.[1], routePathFromHtmlFile(file)).toBeTruthy();
      const title = match![1]!;
      expect(title).not.toMatch(/^Home$|^Index$|^Material for MkDocs$/i);
      expect(title.length).toBeGreaterThan(5);
      titles.push(title);
    }
    expect(new Set(titles).size).toBe(titles.length);
    expect(titles.filter((title) => title === "Overview | a11yst")).toHaveLength(0);
  });

  it("includes descriptions on key pages without fake production URLs", async () => {
    await ensureWebsiteBuilt();
    for (const route of KEY_SEO_PAGES) {
      const html = await readBuiltPage(route);
      expect(html, route).toMatch(/<meta name="description" content="[^"]{20,}"/);
      expect(html).not.toMatch(/https:\/\/example\.com/);
      expect(html).not.toMatch(/name="robots" content="[^"]*noindex/i);
    }
  });

  it("keeps canonical URLs unset until production site_url is configured", async () => {
    await ensureWebsiteBuilt();
    const home = await readBuiltPage("/");
    expect(home).not.toMatch(/<link rel="canonical" href="https?:\/\//);
  });

  it("includes Open Graph foundation on the home page", async () => {
    await ensureWebsiteBuilt();
    const home = await readBuiltPage("/");
    expect(home).toMatch(/property="og:title"/);
    expect(home).toMatch(/property="og:description"/);
    expect(home).not.toMatch(/property="og:url" content="https?:\/\//);
  });

  it("generates a sitemap scaffold without production absolute URLs", async () => {
    await ensureWebsiteBuilt();
    const sitemap = await readFile(join(WEBSITE_DIST, "sitemap.xml"), "utf8");
    expect(sitemap).toContain("<urlset");
    expect(sitemap).not.toMatch(/<loc>https?:\/\//);
  });
});
