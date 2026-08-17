import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { parse as parseYaml } from "yaml";
import { describe, expect, it } from "vitest";
import { ensureWebsiteBuilt, WEBSITE_DIST, WEBSITE_DIR } from "../../helpers/website/build.js";

const DOCS = join(WEBSITE_DIR, "docs");

const DOCUMENTED_COMMANDS = [
  "detect",
  "init",
  "audit",
  "profiles",
  "report",
  "flows",
  "doctor",
  "baseline",
  "findings",
  "classify",
  "unclassify",
  "routes",
] as const;

function extractYamlBlocks(markdown: string): string[] {
  const blocks: string[] = [];
  const pattern = /```yaml\n([\s\S]*?)```/g;
  for (const match of markdown.matchAll(pattern)) {
    if (match[1]) blocks.push(match[1]);
  }
  return blocks;
}

describe("reference documentation", () => {
  it("documents real CLI top-level commands", async () => {
    const cliDoc = await readFile(join(DOCS, "reference/cli.md"), "utf8");
    for (const command of DOCUMENTED_COMMANDS) {
      expect(cliDoc).toContain(command);
    }
  });

  it("states no public A11YST_ variables in environment reference", async () => {
    const envDoc = await readFile(join(DOCS, "reference/environment-variables.md"), "utf8");
    expect(envDoc).toMatch(/no public `A11YST_\*` environment variables/i);
    expect(envDoc).not.toMatch(/A11YST_[A-Z0-9_]+\s+=/);
  });

  it("parses GitHub Actions YAML embedded in CI docs", async () => {
    const ciDoc = await readFile(join(DOCS, "ci/index.md"), "utf8");
    const blocks = extractYamlBlocks(ciDoc);
    expect(blocks.length).toBeGreaterThan(0);
    for (const block of blocks) {
      const parsed = parseYaml(block);
      expect(parsed).toBeTruthy();
    }
  });

  it("removes placeholder deferral copy from advanced sections", async () => {
    const paths = [
      "regression-testing/index.md",
      "ci/index.md",
      "reference/index.md",
      "source-intelligence/index.md",
      "frameworks/index.md",
    ];
    for (const rel of paths) {
      const content = await readFile(join(DOCS, rel), "utf8");
      expect(content, rel).not.toMatch(/will expand in a later documentation phase/i);
      expect(content, rel).not.toMatch(/upcoming documentation phases/i);
    }
  });

  it("does not document fake global npm install as current path", async () => {
    const ciDoc = await readFile(join(DOCS, "ci/index.md"), "utf8");
    expect(ciDoc).not.toMatch(/npm install -g @a11yst\/cli/);
    expect(ciDoc).toMatch(/pre-release|published to npm/i);
  });

  it("uses probabilistic source mapping wording", async () => {
    const mapping = await readFile(join(DOCS, "source-intelligence/source-mapping.md"), "utf8");
    expect(mapping).toMatch(/likely source/i);
    expect(mapping).not.toMatch(/always finds the exact/i);
  });

  it("does not claim React Native is currently supported in frameworks overview", async () => {
    const frameworks = await readFile(join(DOCS, "frameworks/index.md"), "utf8");
    expect(frameworks).toMatch(/not.*currently supported/i);
    expect(frameworks).not.toMatch(/React Native.*First-class/i);
  });
});

describe("built documentation claims", () => {
  it("avoids unsupported marketing claims in built HTML", async () => {
    await ensureWebsiteBuilt();
    const pages = [
      "reference/cli/index.html",
      "source-intelligence/source-mapping/index.html",
      "frameworks/react/index.html",
      "ci/index.html",
    ];
    for (const page of pages) {
      const html = await readFile(join(WEBSITE_DIST, page), "utf8");
      expect(html).not.toMatch(/WCAG certification|guaranteed compliance|AI-powered accessibility/i);
      expect(html).not.toMatch(/Findings \(axe\)|axe impact|axe-core in Chromium/i);
    }
  });
});
