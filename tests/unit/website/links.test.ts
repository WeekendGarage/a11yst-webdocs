import { describe, expect, it } from "vitest";
import {
  collectInternalLinks,
  ensureWebsiteBuilt,
  listBuiltHtmlFiles,
  resolveBuiltRoute,
} from "../../helpers/website/build.js";

describe("website internal links", () => {
  it("has no broken internal links in built HTML", async () => {
    await ensureWebsiteBuilt();
    const htmlFiles = await listBuiltHtmlFiles();
    const broken: string[] = [];

    for (const htmlFile of htmlFiles) {
      const links = await collectInternalLinks(htmlFile);
      for (const href of links) {
        const target = await resolveBuiltRoute(href);
        if (!target) {
          broken.push(`${htmlFile} -> ${href}`);
        }
      }
    }

    expect(broken).toEqual([]);
  });

  it("does not use empty or placeholder hrefs", async () => {
    await ensureWebsiteBuilt();
    const htmlFiles = await listBuiltHtmlFiles();
    for (const htmlFile of htmlFiles) {
      const links = await collectInternalLinks(htmlFile);
      expect(links).not.toContain("#");
      expect(links).not.toContain("");
    }
  });
});
