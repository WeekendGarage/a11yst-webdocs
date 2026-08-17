import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { WEBSITE_DIR } from "../../helpers/website/build.js";

const LANDING_DIR = join(WEBSITE_DIR, "docs/assets/landing");

describe("website landing demo assets", () => {
  it("keeps curated terminal demo content without local paths", () => {
    const terminalFull = readFileSync(join(LANDING_DIR, "terminal-full.txt"), "utf8");
    expect(terminalFull).toContain("$ a11yst audit");
    expect(terminalFull).toContain("Running accessibility audit...");
    expect(terminalFull).toContain("CRITICAL");
    expect(terminalFull).toContain("select-name");
    expect(terminalFull).toContain("Result: 3 issues found.");
    expect(terminalFull).not.toMatch(/\/Users\//);
  });

  it("keeps checked-in landing demo files as static assets", () => {
    expect(readFileSync(join(LANDING_DIR, "styles.css"), "utf8")).toContain(":root");
    expect(readFileSync(join(LANDING_DIR, "report.js"), "utf8")).toContain("addEventListener");
    const sourceExample = JSON.parse(
      readFileSync(join(LANDING_DIR, "source-example.json"), "utf8"),
    ) as { sourcePath?: string };
    expect(sourceExample.sourcePath).not.toContain("/Users/");
  });
});
