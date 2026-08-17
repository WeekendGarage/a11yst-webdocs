import { describe, expect, it } from "vitest";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { WEBSITE_DIR } from "../../helpers/website/build.js";

describe("website packaging", () => {
  it("keeps the website package private and non-publishable", async () => {
    const raw = await readFile(join(WEBSITE_DIR, "package.json"), "utf8");
    const manifest = JSON.parse(raw) as {
      name: string;
      private?: boolean;
      publishConfig?: unknown;
    };
    expect(manifest.name).toBe("a11yst-webdocs");
    expect(manifest.private).toBe(true);
    expect(manifest.publishConfig).toBeUndefined();
  });
});
