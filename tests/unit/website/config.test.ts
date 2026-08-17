import { readFile, lstat } from "node:fs/promises";
import { join } from "node:path";
import { parse as parseYaml } from "yaml";
import { describe, expect, it } from "vitest";
import { WEBSITE_DIR } from "../../helpers/website/build.js";

describe("website MkDocs configuration", () => {
  it("uses Material theme with required navigation and search features", async () => {
    const raw = await readFile(join(WEBSITE_DIR, "mkdocs.yml"), "utf8");
    const config = parseYaml(raw) as {
      theme?: {
        name?: string;
        custom_dir?: string;
        features?: string[];
        font?: boolean;
      };
      plugins?: unknown[];
    };
    expect(config.theme?.name).toBe("material");
    expect(config.theme?.custom_dir).toBe("overrides");
    expect(config.theme?.font).toBe(false);
    const features = config.theme?.features ?? [];
    expect(features).toContain("navigation.sections");
    expect(features).not.toContain("navigation.indexes");
    expect(features).toContain("navigation.tracking");
    expect(features).not.toContain("navigation.top");
    expect(features).toContain("toc.follow");
    expect(features).not.toContain("navigation.tabs");
    expect(features).not.toContain("toc.integrate");
    expect(features).toContain("search.suggest");
    expect(features).toContain("search.highlight");
    expect(features).toContain("content.code.copy");
    expect(config.plugins).toEqual(["search"]);
  });

  it("does not depend on React, Docusaurus, or a documentation backend", async () => {
    const manifest = JSON.parse(
      await readFile(join(WEBSITE_DIR, "package.json"), "utf8"),
    ) as { dependencies?: Record<string, string>; devDependencies?: Record<string, string> };
    const deps = { ...manifest.dependencies, ...manifest.devDependencies };
    expect(deps).not.toHaveProperty("react");
    expect(deps).not.toHaveProperty("react-dom");
    expect(deps).not.toHaveProperty("@docusaurus/core");
    expect(deps).not.toHaveProperty("@docusaurus/preset-classic");
  });

  it("defines foundation documentation navigation sections", async () => {
    const raw = await readFile(join(WEBSITE_DIR, "mkdocs.yml"), "utf8");
    const config = parseYaml(raw) as { nav?: unknown[] };
    const navText = JSON.stringify(config.nav ?? []);
    expect(navText).toMatch(/Getting Started/i);
    expect(navText).toMatch(/Core Concepts/i);
    expect(navText).toMatch(/Regression Testing/i);
    expect(navText).toMatch(/Reports/i);
    expect(navText).toMatch(/Source Intelligence/i);
    expect(navText).toMatch(/Frameworks/i);
    expect(navText).toMatch(/Reference/i);
    expect(navText).toMatch(/Troubleshooting/i);
    expect(navText).toMatch(/CI/i);
    expect(navText).not.toMatch(/React Native/i);
    expect(navText).not.toMatch(/\bHome\b/i);
  });

  it("pins reproducible Python dependencies", async () => {
    const requirements = await readFile(join(WEBSITE_DIR, "requirements.txt"), "utf8");
    expect(requirements).toMatch(/mkdocs==1\.6\.1/);
    expect(requirements).toMatch(/mkdocs-material==9\.7\.7/);
  });

  it("uses local brand assets rather than product-repo symlinks", async () => {
    const logoPath = join(WEBSITE_DIR, "docs/assets/brand/a11yst-lockup.svg");
    const faviconPath = join(WEBSITE_DIR, "docs/assets/brand/favicon.svg");
    expect((await lstat(logoPath)).isSymbolicLink()).toBe(false);
    expect((await lstat(faviconPath)).isSymbolicLink()).toBe(false);
    const config = parseYaml(await readFile(join(WEBSITE_DIR, "mkdocs.yml"), "utf8")) as {
      theme?: { logo?: string; favicon?: string };
    };
    expect(config.theme?.logo).toBe("assets/brand/a11yst-lockup.svg");
    expect(config.theme?.favicon).toBe("assets/brand/favicon.svg");
  });
});
