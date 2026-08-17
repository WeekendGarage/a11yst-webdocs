import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  ensureWebsiteBuilt,
  WEBSITE_DIST,
} from "../../helpers/website/build.js";

describe("website promotional landing", () => {
  it("renders the home landing template with canonical identity", async () => {
    await ensureWebsiteBuilt();
    const home = await readFile(join(WEBSITE_DIST, "index.html"), "utf8");
    expect(home).toContain('class="a11yst-landing"');
    expect(home).toContain("Your accessibility analyst.");
    expect(home).toMatch(/<h1[^>]*id="a11yst-hero-title"[^>]*>[\s\S]*?a11yst/);
    expect(home).toContain("a11yst-hero__symbol");
    expect(home).toContain('id="a11yst-getting-started"');
    expect(home).toContain('href="#a11yst-getting-started"');
    expect(home).toContain("Read the docs");
    expect(home).toContain('id="a11yst-terminal-output"');
    expect(home).toContain("CRITICAL");
    expect(home).toContain("select-name");
    expect(home).toMatch(/a11yst audit/i);
    expect(home).not.toMatch(/\bAlly\b/);
  });

  it("loads home-only assets on the landing page only", async () => {
    await ensureWebsiteBuilt();
    const home = await readFile(join(WEBSITE_DIST, "index.html"), "utf8");
    const docs = await readFile(
      join(WEBSITE_DIST, "getting-started/index.html"),
      "utf8",
    );
    expect(home).toContain("stylesheets/home.css");
    expect(home).toContain("javascripts/home.js");
    expect(docs).not.toContain("stylesheets/home.css");
    expect(docs).not.toContain("javascripts/home.js");
  });

  it("includes real demo assets on home", async () => {
    await ensureWebsiteBuilt();
    const home = await readFile(join(WEBSITE_DIST, "index.html"), "utf8");
    expect(home).toContain("Likely source");
    expect(home).toContain("SocialLinks.jsx");
    expect(home).not.toMatch(/\/Users\//);
    expect(home).not.toMatch(/127\.0\.0\.1/);
  });

  it("keeps documentation pages conventional", async () => {
    await ensureWebsiteBuilt();
    const docs = await readFile(
      join(WEBSITE_DIST, "getting-started/index.html"),
      "utf8",
    );
    expect(docs).toContain('class="md-sidebar md-sidebar--primary"');
    expect(docs).toContain('aria-label="On this page"');
    expect(docs).not.toContain("a11yst-landing");
    expect(docs).not.toContain("a11yst-hero");
  });
});
