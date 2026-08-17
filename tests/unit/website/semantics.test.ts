import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import {
  ensureWebsiteBuilt,
  listBuiltHtmlFiles,
  routePathFromHtmlFile,
} from "../../helpers/website/build.js";

describe("website HTML semantics", () => {
  it("sets document language and a meaningful h1 on every public page", async () => {
    await ensureWebsiteBuilt();
    const htmlFiles = await listBuiltHtmlFiles();
    for (const file of htmlFiles) {
      const html = await readFile(file, "utf8");
      const route = routePathFromHtmlFile(file);
      expect(html, route).toMatch(/<html[^>]*lang="en"/);
      expect(html, route).toMatch(/<h1[^>]*>[\s\S]*?<\/h1>/);
      expect(html, route).not.toMatch(/<h1[^>]*>\s*<\/h1>/);
    }
  });

  it("avoids duplicate element ids in representative pages", async () => {
    await ensureWebsiteBuilt();
    const htmlFiles = await listBuiltHtmlFiles();
    for (const file of htmlFiles) {
      const html = await readFile(file, "utf8");
      const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1] ?? "");
      const seen = new Set<string>();
      const duplicates: string[] = [];
      for (const id of ids) {
        if (seen.has(id)) duplicates.push(id);
        seen.add(id);
      }
      expect(duplicates, routePathFromHtmlFile(file)).toEqual([]);
    }
  });
});
